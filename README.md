# Teclado de Umbundu

Teclado QWERTY interativo com vogais nasais (ã, ẽ, ĩ, õ, ũ) e ñ. Funciona no navegador (PWA) e como **APK Android** (Capacitor), gerado automaticamente pelo GitHub Actions.

## Gerar o APK pelo GitHub

1. Crie um repositório no GitHub e envie **todo** o conteúdo desta pasta (inclusive `.github/`).
2. Abra a aba **Actions** → workflow **Build APK** (roda sozinho a cada push em `main`; ou clique em *Run workflow*).
3. Ao terminar (~5–10 min), abra a execução e baixe o artefato **Teclado-Umbundu-apk** (zip com `Teclado-Umbundu-debug.apk`).
4. Passe o `.apk` ao celular e instale (permita "instalar apps desconhecidos").

### APK em Releases (opcional)
```
git tag v1.0.0 && git push --tags
```
O APK aparece em **Releases**.

### APK release assinado (opcional)
Crie estes *Secrets* em Settings → Secrets and variables → Actions:
`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
Gerar keystore: `keytool -genkey -v -keystore release.keystore -alias teclado -keyalg RSA -keysize 2048 -validity 10000` e depois `base64 -w0 release.keystore`.

## Desenvolvimento local
```
npm install
npm run dev
```

## Notas
- No APK o teclado do sistema fica oculto (`inputMode="none"`) para usar só o teclado virtual.
- "Copiar" e "Baixar .txt" usam plugins nativos (área de transferência e menu Compartilhar).
- O service worker/PWA só é ativado no navegador.
