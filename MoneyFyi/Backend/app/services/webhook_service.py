import logging
import httpx
from typing import Dict, Any

from ..config import settings

logger = logging.getLogger("moneyfyi.backend.webhooks")

class WebhookService:
    def __init__(self):
        self.webhook_url = settings.n8n_webhook_url
        self.client = httpx.AsyncClient(timeout=10.0)

    async def send_alert(self, alert_data: Dict[str, Any]):
        """
        Send an alert payload to the n8n webhook.
        """
        if "example.com" in self.webhook_url:
            logger.warning("N8N Webhook URL not configured, skipping alert notification.")
            return

        try:
            logger.info(f"Sending alert to n8n: {alert_data.get('type')} - {alert_data.get('severity')}")
            
            response = await self.client.post(
                self.webhook_url,
                json=alert_data
            )
            
            if response.status_code >= 400:
                logger.error(f"Failed to send webhook: {response.status_code} - {response.text}")
            else:
                logger.info("Successfully sent alert to n8n")
                
        except Exception as e:
            logger.exception("Error sending webhook notification")

    async def close(self):
        await self.client.aclose()

# Singleton instance
webhook_service = WebhookService()
