# n8n Integration Setup Guide

## 1. Install and Start n8n

```bash
# Install n8n globally
npm install -g n8n

# Or use Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# Start n8n
n8n start
```

Access n8n at: `http://localhost:5678`

---

## 2. Import the DJ Workflow

1. **Copy the workflow JSON** from `n8n-dj-workflow.json`
2. **In n8n UI**: Go to **Workflows** → **Import from JSON**
3. **Paste the JSON** and click **Import**
4. **Activate the workflow** by clicking the toggle

---

## 3. Configure Environment Variables

Copy `.env.example` to `.env` and update:

```bash
cp dj-platform/.env.example dj-platform/.env
```

Update these values:
- `N8N_WEBHOOK_URL`: Your n8n webhook URL
- `SMTP_*`: Email settings for notifications
- `SLACK_WEBHOOK_URL`: Slack webhook for notifications

---

## 4. Test the Integration

### Backend Test:
```bash
# Start your backend
cd dj-platform/server
node index.js
```

### Upload Test:
```bash
# Upload a CSV + image via your frontend
# Or use cURL:
curl -X POST http://localhost:5000/api/upload \
  -F "files=@tracks.csv" \
  -F "files=@screenshot.jpg"
```

### Expected Flow:
1. **Upload** → Backend processes OCR/matching
2. **Backend** → Sends results to n8n webhook
3. **n8n** → Triggers automation (email, Slack, library update)

---

## 5. Customize Automations

### Available Triggers:
- `track_upload`: When new tracks are uploaded/matched
- `purchase_complete`: When a track is purchased
- `sample_generated`: When AI generates samples
- `mix_created`: When a new mix is created

### Available Actions:
- `notify_email`: Send email notifications
- `notify_slack`: Send Slack messages
- `add_to_library`: Add tracks to your library
- `sync_platforms`: Sync with music platforms
- `backup_files`: Backup uploaded files
- `generate_samples`: Trigger AI sample generation

### Example: Create Custom Automation
```javascript
// Use the n8n MCP to create a new automation
{
  "name": "Track Purchase Notification",
  "trigger": "purchase_complete",
  "actions": ["notify_email", "add_to_library", "notify_slack"]
}
```

---

## 6. Advanced Workflows

### A. Beatport Auto-Purchase
- **Trigger**: Track identified with high confidence
- **Action**: Auto-purchase if price < $2.00

### B. Sample Generation Pipeline
- **Trigger**: New track added to library
- **Actions**: Generate samples → Tag samples → Notify completion

### C. Mix Analysis
- **Trigger**: New mix uploaded
- **Actions**: Analyze tracklist → Find purchase links → Update library

---

## 7. Monitoring & Debugging

### Check n8n Logs:
```bash
# In n8n UI: Executions tab
# Or check server logs
```

### Check Backend Logs:
```bash
# Look for these messages:
✅ Sent results to n8n workflow
❌ Failed to send to n8n: [error]
📚 Adding to library: [track info]
```

### Test Webhook Directly:
```bash
curl -X POST http://localhost:5678/webhook/dj-track-uploaded \
  -H "Content-Type: application/json" \
  -d '{"results": [{"file": "test.jpg", "match": {"DJ Name": "Test DJ"}}]}'
```

---

## 8. Troubleshooting

### Common Issues:

**n8n not receiving webhooks:**
- Check `N8N_WEBHOOK_URL` in `.env`
- Ensure n8n is running on port 5678
- Verify webhook path in n8n workflow

**Email notifications not working:**
- Configure SMTP credentials in n8n
- Test email node separately

**Slack notifications failing:**
- Update Slack webhook URL in workflow
- Test Slack webhook separately

---

## 9. Next Steps

- **Add more platforms**: Extend to SoundCloud, Bandcamp, etc.
- **AI enhancements**: Use AI to improve OCR matching
- **Mobile notifications**: Add push notifications via n8n
- **Analytics**: Track automation performance and success rates

---

**🎵 Your DJ platform is now fully automated with n8n!**