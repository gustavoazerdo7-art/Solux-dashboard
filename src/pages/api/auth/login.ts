import { NextApiRequest, NextApiResponse } from 'next';
import { getAbsoluteUrl } from '@/utils/get-absolute-url';

// ❗ IMPORTANTE: Remova qualquer import de CLIENT_ID do arquivo server.
// Pegue direto das envs para evitar erro.
const clientId = process.env.CLIENT_ID;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { locale } = req.query as { locale?: string };

  // 🔍 Validação: CLIENT_ID precisa existir e ser um número (snowflake)
  if (!clientId || !/^\d+$/.test(clientId)) {
    return res.status(500).json({
      error: 'CLIENT_ID inválido ou não configurado.',
      received: clientId,
      note: 'Defina CLIENT_ID nas variáveis de ambiente (Vercel ou .env.local).'
    });
  }

  // 🔗 Geração do link OAuth com o CLIENT_ID correto
  const url =
    'https://discord.com/api/oauth2/authorize?' +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${getAbsoluteUrl()}/api/auth/callback`,
      response_type: 'code',
      scope: 'identify guilds',
      state: locale ?? '',
    });

  return res.redirect(302, url);
}
