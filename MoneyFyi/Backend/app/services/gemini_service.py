import json
import logging
from typing import Any, Dict, List, Optional
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from ..config import settings

logger = logging.getLogger("moneyfyi.backend.gemini")

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        # Using gemini-pro-vision for image/document analysis
        self.model = genai.GenerativeModel('gemini-pro-vision')
        
        # Configure safety settings to be less restrictive for financial docs
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        }

    async def extract_data_from_image(self, image_data: bytes, prompt: str) -> Dict[str, Any]:
        """
        Analyze an image (document) and extract structured data based on the prompt.
        Expects the model to return JSON.
        """
        try:
            # Prepare the content
            contents = [
                prompt,
                {
                    "mime_type": "image/jpeg", # Assuming JPEG/PNG, Gemini handles most
                    "data": image_data
                }
            ]
            
            response = await self.model.generate_content_async(
                contents,
                safety_settings=self.safety_settings,
                generation_config={"response_mime_type": "application/json"}
            )
            
            # Parse JSON response
            try:
                return json.loads(response.text)
            except json.JSONDecodeError:
                logger.error("Failed to parse Gemini response as JSON: %s", response.text)
                # Fallback: try to find JSON block if strict mode failed (though response_mime_type usually fixes this)
                text = response.text
                start = text.find('{')
                end = text.rfind('}') + 1
                if start != -1 and end != -1:
                    return json.loads(text[start:end])
                raise ValueError("Invalid JSON response from Gemini")
                
        except Exception as e:
            logger.exception("Gemini extraction failed")
            raise e

    async def generate_insights(self, context_data: Dict[str, Any], prompt: str) -> str:
        """
        Generate text insights based on provided data context.
        """
        try:
            full_prompt = f"{prompt}\n\nContext Data:\n{json.dumps(context_data, indent=2)}"
            
            response = await self.model.generate_content_async(
                full_prompt,
                safety_settings=self.safety_settings
            )
            return response.text
        except Exception as e:
            logger.exception("Gemini insight generation failed")
            raise e

# Singleton instance
gemini_service = GeminiService()
