import { exec } from 'child_process';

export function showMessage(message: string) {
  const escaped = message.replace(/'/g, "''"); // 작은따옴표 이스케이프
  const command = `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${escaped}', '디버그')"`;

  exec(command);
}