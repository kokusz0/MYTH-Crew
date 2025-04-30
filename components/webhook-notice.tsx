export default function WebhookNotice() {
  return (
    <div className="p-4 bg-yellow-900/50 border border-yellow-600 rounded-md text-yellow-200 mt-4">
      <h3 className="font-semibold mb-1">Form Submission Notice</h3>
      <p className="text-sm">
        This is a preview of the form. When deployed with proper environment variables, submissions will be sent to
        Discord.
      </p>
    </div>
  )
}
