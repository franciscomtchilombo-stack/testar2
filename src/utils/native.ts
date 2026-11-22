import { Capacitor } from '@capacitor/core';
import { Clipboard } from '@capacitor/clipboard';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/** True quando o app roda empacotado (APK), e não no navegador. */
export const isNative = Capacitor.isNativePlatform();

export async function copyText(text: string): Promise<void> {
  if (isNative) {
    await Clipboard.write({ string: text });
    return;
  }
  await navigator.clipboard.writeText(text);
}

/** Salva/compartilha um .txt. No APK abre o menu "Compartilhar" do Android. */
export async function exportTxt(text: string, filename: string): Promise<void> {
  if (isNative) {
    const { uri } = await Filesystem.writeFile({
      path: filename,
      data: text,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });
    await Share.share({ title: filename, url: uri, dialogTitle: 'Salvar ou enviar texto' });
    return;
  }
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
