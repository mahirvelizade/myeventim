'use client';

import { useEffect, useState } from 'react';
import { Send, History, Loader } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

export default function AdminBroadcastPage() {
  const [text, setText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [miniAppPath, setMiniAppPath] = useState('');
  const [linkType, setLinkType] = useState<'url' | 'miniapp' | 'none'>('none');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    adminApi.broadcasts.list(1, 50)
      .then((res) => setMessages(res.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setResult('');

    try {
      const data: any = { text };
      if (linkType === 'url' && buttonUrl) {
        data.buttonText = buttonText || 'Link';
        data.buttonUrl = buttonUrl;
      } else if (linkType === 'miniapp' && miniAppPath) {
        data.buttonText = buttonText || 'Open';
        data.miniAppPath = miniAppPath;
      }

      const res = await adminApi.broadcasts.create(data);
      setResult(`Broadcast #${res.data.id.slice(0, 8)} created. Use "Send Now" to deliver.`);
      setText('');
      setButtonText('');
      setButtonUrl('');
      setMiniAppPath('');
      setLinkType('none');

      const refreshed = await adminApi.broadcasts.list(1, 50);
      setMessages(refreshed.items || []);
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Failed'}`);
    } finally {
      setSending(false);
    }
  };

  const handleSendNow = async (id: string) => {
    if (!confirm('Send this broadcast to ALL users? This cannot be undone.')) return;
    try {
      const res = await adminApi.broadcasts.send(id);
      setResult(`Sent: ${res.data.sentCount} delivered, ${res.data.failedCount} failed`);
      const refreshed = await adminApi.broadcasts.list(1, 50);
      setMessages(refreshed.items || []);
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Failed'}`);
    }
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500/10 text-yellow-400',
      SENDING: 'bg-blue-500/10 text-blue-400',
      COMPLETED: 'bg-emerald-500/10 text-emerald-400',
    };
    return (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-800 text-gray-400'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-200">
          <Send className="h-4 w-4 text-rose-400" />
          New Broadcast
        </h2>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Message Text (Markdown supported)</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5}
              placeholder="Write your broadcast message..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-rose-500 focus:outline-none"
              required />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Button</label>
            <div className="flex gap-1 rounded-lg bg-gray-800 p-1">
              {(['none', 'url', 'miniapp'] as const).map((type) => (
                <button key={type} type="button" onClick={() => setLinkType(type)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    linkType === type ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}>
                  {type === 'none' ? 'No Button' : type === 'url' ? 'URL' : 'Mini App'}
                </button>
              ))}
            </div>
          </div>

          {linkType !== 'none' && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Button Text</label>
                <input value={buttonText} onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Click here" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-rose-500 focus:outline-none" />
              </div>
              {linkType === 'url' ? (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">Button URL</label>
                  <input value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="https://..." className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-rose-500 focus:outline-none" />
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">Mini App Path</label>
                  <input value={miniAppPath} onChange={(e) => setMiniAppPath(e.target.value)}
                    placeholder="/my-invitations" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-rose-500 focus:outline-none" />
                </div>
              )}
            </>
          )}

          <button type="submit" disabled={sending}
            className="w-full rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50">
            {sending ? 'Creating...' : 'Create Broadcast'}
          </button>

          {result && (
            <div className="rounded-lg bg-gray-800 px-4 py-2.5 text-xs text-gray-300">
              {result}
            </div>
          )}
        </form>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-200">
          <History className="h-4 w-4 text-rose-400" />
          Broadcast History
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-5 w-5 animate-spin text-gray-500" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">No broadcasts sent yet</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 line-clamp-2">{msg.text}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {statusBadge(msg.status)}
                </div>
                {(msg.sentCount > 0 || msg.failedCount > 0) && (
                  <div className="mt-2 flex gap-3 text-xs text-gray-400">
                    <span className="text-emerald-400">{msg.sentCount} sent</span>
                    {msg.failedCount > 0 && <span className="text-red-400">{msg.failedCount} failed</span>}
                    <span>{msg.totalCount} total</span>
                  </div>
                )}
                {msg.status === 'PENDING' && (
                  <button onClick={() => handleSendNow(msg.id)}
                    className="mt-2 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-600">
                    Send Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
