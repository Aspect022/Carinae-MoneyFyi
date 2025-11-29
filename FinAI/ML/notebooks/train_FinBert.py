

import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer, AutoModelForSequenceClassification, get_linear_schedule_with_warmup
from torch.optim import AdamW
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm
import warnings
from datetime import datetime
warnings.filterwarnings('ignore')

# Device configuration
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

class Config:
    MODEL_NAME = 'ProsusAI/finbert'
    MAX_LENGTH = 256
    NUM_LABELS = 3
    BATCH_SIZE = 8
    LEARNING_RATE = 2e-5
    EPOCHS = 3
    WARMUP_STEPS = 50
    MAX_GRAD_NORM = 1.0
    TEST_SIZE = 0.2
    VAL_SIZE = 0.1
    RANDOM_STATE = 42
    MODEL_SAVE_PATH = 'market_sentiment_finbert.pth'
    DEVICE = device

class MarketSentimentDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]
        
        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'label': torch.tensor(label, dtype=torch.long)
        }

def create_market_data():
    data = {
        'text': [
            "Stock market rallies to record highs on strong economic data",
            "S&P 500 surges as tech stocks lead broad market gains",
            "Dow Jones hits all-time high fueled by investor optimism",
            "Bull market continues with major indices posting strong gains",
            "Market sentiment turns bullish after Fed signals patience",
            "Strong earnings reports drive market to new peaks",
            "Tech sector leads market surge with impressive gains",
            "Financial stocks soar on rising interest rate environment",
            "Market optimism grows as inflation shows signs of cooling",
            "Banking sector rallies on strong loan growth outlook",
            
            "Stock market plunges on recession fears and weak data",
            "Major sell-off continues as investors flee to safety",
            "Market crash wipes billions in value amid panic selling",
            "Bear market deepens with indices posting heavy losses",
            "Nasdaq tumbles as tech stocks face severe pressure",
            "Market volatility spikes as uncertainty grips investors",
            "Financial sector under pressure from credit concerns",
            "Energy stocks collapse as oil prices crater",
            "Market sell-off accelerates on geopolitical tensions",
            "Banking stocks plummet on lending crisis fears",
            
            "Markets close mixed with no clear directional trend",
            "Trading volumes remain light as investors stay cautious",
            "Stock market treads water ahead of Fed decision",
            "Indices finish flat in quiet pre-holiday trading session",
            "Market consolidates recent gains in sideways trading",
            "Investors await earnings season before making moves",
            "Market holds steady despite mixed economic indicators",
            "Stocks range-bound as conflicting signals emerge",
            "Market sentiment neutral as bulls and bears balanced",
            "Indices trade within established support resistance levels"
        ],
        'sentiment': [
            0,0,0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1,1,1,
            2,2,2,2,2,2,2,2,2,2
        ]
    }
    df = pd.DataFrame(data)
    print(f"Created {len(df)} training samples")
    return df

def prepare_data(df, config):
    train_val_texts, test_texts, train_val_labels, test_labels = train_test_split(
        df['text'].values,
        df['sentiment'].values,
        test_size=config.TEST_SIZE,
        random_state=config.RANDOM_STATE,
        stratify=df['sentiment'].values
    )
    
    val_size_adjusted = config.VAL_SIZE / (1 - config.TEST_SIZE)
    train_texts, val_texts, train_labels, val_labels = train_test_split(
        train_val_texts,
        train_val_labels,
        test_size=val_size_adjusted,
        random_state=config.RANDOM_STATE,
        stratify=train_val_labels
    )
    
    print(f"\nTraining samples: {len(train_texts)}")
    print(f"Validation samples: {len(val_texts)}")
    print(f"Test samples: {len(test_texts)}\n")
    
    return (train_texts, train_labels), (val_texts, val_labels), (test_texts, test_labels)

def train_epoch(model, data_loader, optimizer, scheduler, device):
    model.train()
    total_loss = 0
    correct = 0
    total = 0
    
    for batch in tqdm(data_loader, desc="Training"):
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['label'].to(device)
        
        optimizer.zero_grad()
        outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
        loss = outputs.loss
        
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        scheduler.step()
        
        total_loss += loss.item()
        preds = torch.argmax(outputs.logits, dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
    
    return total_loss / len(data_loader), correct / total

def eval_model(model, data_loader, device):
    model.eval()
    total_loss = 0
    correct = 0
    total = 0
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for batch in tqdm(data_loader, desc="Evaluating"):
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['label'].to(device)
            
            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            
            total_loss += loss.item()
            preds = torch.argmax(outputs.logits, dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    
    return total_loss / len(data_loader), correct / total, all_preds, all_labels

def plot_training_history(history):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
    epochs = range(1, len(history['train_loss']) + 1)
    
    ax1.plot(epochs, history['train_loss'], 'b-o', label='Train Loss', linewidth=2)
    ax1.plot(epochs, history['val_loss'], 'r-s', label='Val Loss', linewidth=2)
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Loss')
    ax1.set_title('Training and Validation Loss')
    ax1.legend()
    ax1.grid(True)
    
    ax2.plot(epochs, history['train_acc'], 'b-o', label='Train Acc', linewidth=2)
    ax2.plot(epochs, history['val_acc'], 'r-s', label='Val Acc', linewidth=2)
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Accuracy')
    ax2.set_title('Training and Validation Accuracy')
    ax2.legend()
    ax2.grid(True)
    
    plt.tight_layout()
    plt.savefig('training_history.png', dpi=300)
    print("✓ Training history saved to 'training_history.png'")
    plt.close()

def plot_confusion_matrix(y_true, y_pred):
    cm = confusion_matrix(y_true, y_pred)
    labels = ['Positive', 'Negative', 'Neutral']
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig('confusion_matrix.png', dpi=300)
    print("✓ Confusion matrix saved to 'confusion_matrix.png'")
    plt.close()

def main():
    print("="*60)
    print("FinBERT Market Sentiment Analysis System")
    print("="*60)
    
    config = Config()
    
    print("\nStep 1: Loading data...")
    df = create_market_data()
    df.to_csv('market_sentiment_data.csv', index=False)
    
    print("\nStep 2: Preparing data splits...")
    train_data, val_data, test_data = prepare_data(df, config)
    
    print("Step 3: Loading FinBERT model...")
    tokenizer = AutoTokenizer.from_pretrained(config.MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(config.MODEL_NAME, num_labels=config.NUM_LABELS)
    model.to(config.DEVICE)
    
    print("\nStep 4: Creating data loaders...")
    train_dataset = MarketSentimentDataset(train_data[0], train_data[1], tokenizer, config.MAX_LENGTH)
    val_dataset = MarketSentimentDataset(val_data[0], val_data[1], tokenizer, config.MAX_LENGTH)
    test_dataset = MarketSentimentDataset(test_data[0], test_data[1], tokenizer, config.MAX_LENGTH)
    
    train_loader = DataLoader(train_dataset, batch_size=config.BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=config.BATCH_SIZE)
    test_loader = DataLoader(test_dataset, batch_size=config.BATCH_SIZE)
    
    print("\nStep 5: Setting up training...")
    optimizer = AdamW(model.parameters(), lr=config.LEARNING_RATE)
    total_steps = len(train_loader) * config.EPOCHS
    scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=config.WARMUP_STEPS, num_training_steps=total_steps)
    
    print("\nStep 6: Training model...")
    history = {'train_loss': [], 'train_acc': [], 'val_loss': [], 'val_acc': []}
    best_val_acc = 0
    
    for epoch in range(config.EPOCHS):
        print(f"\nEpoch {epoch + 1}/{config.EPOCHS}")
        print("-" * 60)
        
        train_loss, train_acc = train_epoch(model, train_loader, optimizer, scheduler, config.DEVICE)
        val_loss, val_acc, _, _ = eval_model(model, val_loader, config.DEVICE)
        
        history['train_loss'].append(train_loss)
        history['train_acc'].append(train_acc)
        history['val_loss'].append(val_loss)
        history['val_acc'].append(val_acc)
        
        print(f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.4f}")
        print(f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.4f}")
        
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), config.MODEL_SAVE_PATH)
            print(f"✓ Best model saved! (Val Acc: {val_acc:.4f})")
    
    print("\nStep 7: Plotting results...")
    plot_training_history(history)
    
    print("\nStep 8: Final evaluation on test set...")
    model.load_state_dict(torch.load(config.MODEL_SAVE_PATH))
    test_loss, test_acc, predictions, true_labels = eval_model(model, test_loader, config.DEVICE)
    
    print(f"\nTest Loss: {test_loss:.4f}")
    print(f"Test Accuracy: {test_acc:.4f}")
    
    label_names = ['Positive', 'Negative', 'Neutral']
    print("\nClassification Report:")
    print(classification_report(true_labels, predictions, target_names=label_names))
    
    plot_confusion_matrix(true_labels, predictions)
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE!")
    print("="*60)
    print(f"✓ Model saved: {config.MODEL_SAVE_PATH}")
    print(f"✓ Test Accuracy: {test_acc:.4f}")
    print("✓ Plots saved: training_history.png, confusion_matrix.png")
    print("="*60)

if __name__ == "__main__":
    main()