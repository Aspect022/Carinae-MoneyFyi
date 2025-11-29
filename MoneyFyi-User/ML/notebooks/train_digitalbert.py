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
warnings.filterwarnings('ignore')

# Device configuration
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

class Config:
    MODEL_NAME = 'bert-base-uncased'  # Using BERT for digital content
    MAX_LENGTH = 128
    NUM_LABELS = 3  # positive, negative, neutral
    BATCH_SIZE = 16
    LEARNING_RATE = 2e-5
    EPOCHS = 4
    WARMUP_STEPS = 100
    MAX_GRAD_NORM = 1.0
    TEST_SIZE = 0.2
    VAL_SIZE = 0.1
    RANDOM_STATE = 42
    MODEL_SAVE_PATH = 'digitalbert_model.pth'
    DEVICE = device

class DigitalDataset(Dataset):
    """Dataset for digital content sentiment"""
    
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

def create_digital_data():
    """Create training data for digital/tech sentiment"""
    
    data = {
        'text': [
            # POSITIVE SENTIMENTS (Label: 0)
            "This new smartphone is absolutely amazing! Best purchase ever!",
            "Love the new app update! So much faster and easier to use",
            "The customer service was excellent and solved my issue quickly",
            "This software has revolutionized how we work. Highly recommend!",
            "The new iPhone features are incredible. Worth every penny!",
            "Best laptop I've ever owned. Lightning fast performance!",
            "This AI tool has saved me so much time. Game changer!",
            "The user interface is beautiful and intuitive. Love it!",
            "Cloud storage service works perfectly. Never losing files again!",
            "The streaming quality is phenomenal. Crystal clear video!",
            "This smartwatch is amazing for fitness tracking. So accurate!",
            "Best VPN service available. Fast and secure connection!",
            "The new gaming console is absolutely worth the upgrade!",
            "This productivity app has made me so much more efficient!",
            "Excellent video editing software. Professional results!",
            "The camera quality on this phone is stunning!",
            "Best noise-cancelling headphones I've tried. Perfect!",
            "This coding platform makes learning programming so easy!",
            "The e-commerce site is super user-friendly. Great experience!",
            "Amazing smart home integration. Everything works seamlessly!",
            
            # NEGATIVE SENTIMENTS (Label: 1)
            "Terrible product. Waste of money. Do not buy!",
            "The app crashes constantly. Completely unusable!",
            "Worst customer support ever. Still waiting for help!",
            "This software is buggy and slow. Very disappointed!",
            "The phone battery drains in 2 hours. Unacceptable!",
            "Laptop overheats and shuts down randomly. Poor quality!",
            "This tool is confusing and doesn't work as advertised!",
            "The interface is clunky and outdated. Needs major redesign!",
            "Cloud service keeps losing my files. Unreliable!",
            "Streaming constantly buffers. Terrible video quality!",
            "Smartwatch is inaccurate and uncomfortable. Returning it!",
            "VPN is extremely slow and disconnects frequently!",
            "Gaming console has too many technical issues. Frustrated!",
            "App is full of ads and spam. Completely ruins experience!",
            "Video editor crashes every 5 minutes. Can't complete work!",
            "Camera quality is grainy and blurry. Very poor!",
            "Headphones broke after one week. Cheap materials!",
            "Learning platform is confusing and poorly structured!",
            "Website checkout process is broken. Can't complete purchase!",
            "Smart home devices don't work together. Total mess!",
            
            # NEUTRAL SENTIMENTS (Label: 2)
            "The product works as described. Nothing special.",
            "App is okay. Does what it needs to do.",
            "Customer service was fine. Average response time.",
            "Software has basic features. Gets the job done.",
            "Phone is decent for the price. No complaints.",
            "Laptop has standard specs. Works for basic tasks.",
            "The tool is functional but not impressive.",
            "Interface is simple and straightforward. No frills.",
            "Cloud storage offers standard capacity. Fair pricing.",
            "Streaming works but quality could be better.",
            "Smartwatch tracks steps accurately. Basic features only.",
            "VPN provides standard protection. Average speeds.",
            "Gaming console performs adequately. Nothing groundbreaking.",
            "App has useful features. Could use improvements.",
            "Video editor is functional for basic editing needs.",
            "Camera takes acceptable photos in good lighting.",
            "Headphones have decent sound quality. Comfortable fit.",
            "Learning platform covers the basics. Standard content.",
            "Website is easy to navigate. Standard checkout process.",
            "Smart home setup was straightforward. Works as expected.",
            
            # ADDITIONAL POSITIVE EXAMPLES
            "Revolutionary AI features! This is the future!",
            "Best investment in tech I've made this year!",
            "The battery life is incredible. Lasts all day!",
            "Super fast shipping and excellent packaging!",
            "This app has everything I need. Perfect solution!",
            "The design is sleek and modern. Love the aesthetics!",
            "Customer support responded within minutes. Impressed!",
            "Seamless integration with all my devices!",
            "The price point is fantastic for these features!",
            "This has exceeded all my expectations!",
            
            # ADDITIONAL NEGATIVE EXAMPLES
            "Completely broken after one month. Avoid!",
            "False advertising. Product doesn't match description!",
            "Security issues and privacy concerns. Unsafe!",
            "Constantly freezes and requires restarts!",
            "Hidden fees and charges. Not worth it!",
            "Poor build quality. Feels cheap and flimsy!",
            "Technical support is non-existent. No help!",
            "Incompatible with most devices. Limited use!",
            "Updates made it worse. Downgrading if possible!",
            "Refund process is nightmare. Still waiting!",
            
            # ADDITIONAL NEUTRAL EXAMPLES
            "Standard features for this price range.",
            "Works fine for occasional use.",
            "Average performance. Nothing to complain about.",
            "Meets basic requirements. Simple setup.",
            "Comparable to similar products in market.",
            "Functional design. Serves its purpose.",
            "Fair pricing for what you get.",
            "Does the job. No major issues.",
            "Typical features for this category.",
            "Standard warranty and support included."
        ],
        'sentiment': [
            # 0=positive, 1=negative, 2=neutral
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  # Positive (20)
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,  # Negative (20)
            2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,  # Neutral (20)
            0,0,0,0,0,0,0,0,0,0,  # Additional Positive (10)
            1,1,1,1,1,1,1,1,1,1,  # Additional Negative (10)
            2,2,2,2,2,2,2,2,2,2   # Additional Neutral (10)
        ]
    }
    
    df = pd.DataFrame(data)
    print(f"✓ Created {len(df)} digital content training samples")
    print(f"\nSentiment distribution:")
    print(df['sentiment'].value_counts().sort_index())
    print()
    
    return df

def prepare_data(df, config):
    """Split data into train, validation, and test sets"""
    
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
    
    print("="*60)
    print("Data Split Summary")
    print("="*60)
    print(f"Training samples:   {len(train_texts)}")
    print(f"Validation samples: {len(val_texts)}")
    print(f"Test samples:       {len(test_texts)}")
    print("="*60 + "\n")
    
    return (train_texts, train_labels), (val_texts, val_labels), (test_texts, test_labels)

def train_epoch(model, data_loader, optimizer, scheduler, device):
    """Train for one epoch"""
    model.train()
    total_loss = 0
    correct = 0
    total = 0
    
    progress_bar = tqdm(data_loader, desc="Training")
    
    for batch in progress_bar:
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['label'].to(device)
        
        optimizer.zero_grad()
        
        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            labels=labels
        )
        
        loss = outputs.loss
        logits = outputs.logits
        
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        scheduler.step()
        
        total_loss += loss.item()
        preds = torch.argmax(logits, dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
        
        progress_bar.set_postfix({
            'loss': f'{loss.item():.4f}',
            'acc': f'{correct/total:.4f}'
        })
    
    return total_loss / len(data_loader), correct / total

def eval_model(model, data_loader, device):
    """Evaluate model"""
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
            
            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=labels
            )
            
            loss = outputs.loss
            logits = outputs.logits
            
            total_loss += loss.item()
            preds = torch.argmax(logits, dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    
    return total_loss / len(data_loader), correct / total, all_preds, all_labels

def plot_training_history(history):
    """Plot training metrics"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
    epochs = range(1, len(history['train_loss']) + 1)
    
    # Plot losses
    ax1.plot(epochs, history['train_loss'], 'b-o', label='Train Loss', linewidth=2, markersize=8)
    ax1.plot(epochs, history['val_loss'], 'r-s', label='Val Loss', linewidth=2, markersize=8)
    ax1.set_xlabel('Epoch', fontsize=12, fontweight='bold')
    ax1.set_ylabel('Loss', fontsize=12, fontweight='bold')
    ax1.set_title('Training and Validation Loss', fontsize=14, fontweight='bold')
    ax1.legend(fontsize=11)
    ax1.grid(True, alpha=0.3)
    
    # Plot accuracies
    ax2.plot(epochs, history['train_acc'], 'b-o', label='Train Acc', linewidth=2, markersize=8)
    ax2.plot(epochs, history['val_acc'], 'r-s', label='Val Acc', linewidth=2, markersize=8)
    ax2.set_xlabel('Epoch', fontsize=12, fontweight='bold')
    ax2.set_ylabel('Accuracy', fontsize=12, fontweight='bold')
    ax2.set_title('Training and Validation Accuracy', fontsize=14, fontweight='bold')
    ax2.legend(fontsize=11)
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('digitalbert_training_history.png', dpi=300, bbox_inches='tight')
    print("✓ Training history saved to 'digitalbert_training_history.png'")
    plt.close()

def plot_confusion_matrix(y_true, y_pred):
    """Plot confusion matrix"""
    cm = confusion_matrix(y_true, y_pred)
    labels = ['Positive', 'Negative', 'Neutral']
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(
        cm, annot=True, fmt='d', cmap='Blues',
        xticklabels=labels, yticklabels=labels,
        cbar_kws={'label': 'Count'},
        annot_kws={'size': 14, 'fontweight': 'bold'}
    )
    plt.title('Confusion Matrix - DigitalBERT', fontsize=16, fontweight='bold', pad=20)
    plt.ylabel('True Sentiment', fontsize=13, fontweight='bold')
    plt.xlabel('Predicted Sentiment', fontsize=13, fontweight='bold')
    plt.tight_layout()
    plt.savefig('digitalbert_confusion_matrix.png', dpi=300, bbox_inches='tight')
    print("✓ Confusion matrix saved to 'digitalbert_confusion_matrix.png'")
    plt.close()

def main():
    """Main training pipeline"""
    
    print("\n" + "="*60)
    print("     DIGITALBERT - DIGITAL SENTIMENT ANALYSIS")
    print("="*60 + "\n")
    
    # Configuration
    config = Config()
    
    # Step 1: Load data
    print("Step 1: Creating digital content training data...")
    df = create_digital_data()
    df.to_csv('digital_sentiment_data.csv', index=False)
    print("✓ Data saved to 'digital_sentiment_data.csv'\n")
    
    # Step 2: Prepare data splits
    print("Step 2: Preparing data splits...")
    train_data, val_data, test_data = prepare_data(df, config)
    
    # Step 3: Load model
    print("Step 3: Loading BERT model...")
    tokenizer = AutoTokenizer.from_pretrained(config.MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(
        config.MODEL_NAME,
        num_labels=config.NUM_LABELS
    )
    model.to(config.DEVICE)
    print(f"✓ Model loaded on {config.DEVICE}\n")
    
    # Step 4: Create data loaders
    print("Step 4: Creating data loaders...")
    train_dataset = DigitalDataset(train_data[0], train_data[1], tokenizer, config.MAX_LENGTH)
    val_dataset = DigitalDataset(val_data[0], val_data[1], tokenizer, config.MAX_LENGTH)
    test_dataset = DigitalDataset(test_data[0], test_data[1], tokenizer, config.MAX_LENGTH)
    
    train_loader = DataLoader(train_dataset, batch_size=config.BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=config.BATCH_SIZE)
    test_loader = DataLoader(test_dataset, batch_size=config.BATCH_SIZE)
    print("✓ Data loaders ready\n")
    
    # Step 5: Setup training
    print("Step 5: Setting up optimizer and scheduler...")
    optimizer = AdamW(model.parameters(), lr=config.LEARNING_RATE)
    total_steps = len(train_loader) * config.EPOCHS
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=config.WARMUP_STEPS,
        num_training_steps=total_steps
    )
    print("✓ Training setup complete\n")
    
    # Step 6: Training loop
    print("Step 6: Training DigitalBERT...")
    print("="*60)
    
    history = {
        'train_loss': [],
        'train_acc': [],
        'val_loss': [],
        'val_acc': []
    }
    
    best_val_acc = 0
    
    for epoch in range(config.EPOCHS):
        print(f"\nEpoch {epoch + 1}/{config.EPOCHS}")
        print("-" * 60)
        
        # Train
        train_loss, train_acc = train_epoch(
            model, train_loader, optimizer, scheduler, config.DEVICE
        )
        
        # Validate
        val_loss, val_acc, _, _ = eval_model(model, val_loader, config.DEVICE)
        
        # Save history
        history['train_loss'].append(train_loss)
        history['train_acc'].append(train_acc)
        history['val_loss'].append(val_loss)
        history['val_acc'].append(val_acc)
        
        # Print metrics
        print(f"\nTrain Loss: {train_loss:.4f} | Train Acc: {train_acc:.4f}")
        print(f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.4f}")
        
        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), config.MODEL_SAVE_PATH)
            print(f"✓ Best model saved! (Val Acc: {val_acc:.4f})")
    
    # Step 7: Plot training history
    print("\n" + "="*60)
    print("Step 7: Generating training visualizations...")
    plot_training_history(history)
    
    # Step 8: Final evaluation
    print("\nStep 8: Final evaluation on test set...")
    print("="*60)
    
    model.load_state_dict(torch.load(config.MODEL_SAVE_PATH))
    test_loss, test_acc, predictions, true_labels = eval_model(
        model, test_loader, config.DEVICE
    )
    
    print(f"\nTest Loss: {test_loss:.4f}")
    print(f"Test Accuracy: {test_acc:.4f}")
    
    label_names = ['Positive', 'Negative', 'Neutral']
    print("\n" + "-"*60)
    print("Classification Report:")
    print("-"*60)
    print(classification_report(true_labels, predictions, target_names=label_names))
    
    # Plot confusion matrix
    plot_confusion_matrix(true_labels, predictions)
    
    # Final summary
    print("\n" + "="*60)
    print("     TRAINING COMPLETE! 🎉")
    print("="*60)
    print(f"✓ Model saved: {config.MODEL_SAVE_PATH}")
    print(f"✓ Test Accuracy: {test_acc:.4f}")
    print(f"✓ Data saved: digital_sentiment_data.csv")
    print(f"✓ Plots saved:")
    print(f"  - digitalbert_training_history.png")
    print(f"  - digitalbert_confusion_matrix.png")
    print("="*60 + "\n")
    
    print("Next step: Run 'python digitalbert_dashboard.py' to analyze text!")

if __name__ == "__main__":
    main()