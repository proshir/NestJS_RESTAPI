import { NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

function getAvatarPath(avatar_hash: string): string {
  const avatarsDir = path.join(process.cwd(), 'avatars');
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
  }
  const avatarPath = path.join(avatarsDir, avatar_hash);
  return avatarPath;
}

export async function saveAvatar(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new NotFoundException('Failed to fetch avatar.');
  }

  const avatar_hash = `${crypto.randomBytes(14).toString('hex')}.jpg`;
  const avatarPath = getAvatarPath(avatar_hash);
  const avatarBuffer = await response.arrayBuffer();
  fs.writeFileSync(avatarPath, Buffer.from(avatarBuffer));
  return avatar_hash;
}

export function readAvatar(avatar_hash: string): string {
  const avatarPath = getAvatarPath(avatar_hash);
  const avatarFile = fs.readFileSync(avatarPath);
  const avatar = Buffer.from(avatarFile).toString('base64');
  return avatar;
}

export async function deleteAvatar(avatar_hash: string) {
  const avatarPath = getAvatarPath(avatar_hash);
  await fs.promises.unlink(avatarPath);
}
