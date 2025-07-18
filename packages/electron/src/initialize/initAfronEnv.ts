import { app } from 'electron';
import dotenv from 'dotenv';
import { AfronEnv } from '@/runtime/types';
import { updateRegistry } from '@/runtime';

export function initAfronEnv() {
    let env:AfronEnv;
    if (app.isPackaged) {
        env = {
            dev: false,
            devUrl: '',
            inMemory: false,
            skipMasterKeyInitialization: false,
            showDevTool: false,
            defaultProfile: false,
            defaultRT: false,
            logTrace: false,
            logVerbose: false,
        }
    }
    else {
        dotenv.config();

        env = {
            dev: getEnvAsBoolean('DEV'), // 파일 대신 URL에서 프론트엔드 로드
            devUrl: getEnv('DEV_URL') ?? 'http://localhost:3600', // DEV 모드에서 프론트엔드 URL
            inMemory: getEnvAsBoolean('IN_MEMORY'), // 휘발성 모드
            skipMasterKeyInitialization: getEnvAsBoolean('SKIP_MASTER_KEY_INITAILIZATION'), // 마스터키 초기화 생략
            showDevTool: getEnvAsBoolean('SHOW_DEVTOOL'), // 실행시 개발자 도구 열기
            defaultProfile: getEnvAsBoolean('DEFAULT_PROFILE'), // 초기 프로필이 미리 생성됨
            defaultRT: getEnvAsBoolean('DEFAULT_RT'), // 초기 RT가 미리 생성됨
            logTrace: getEnvAsBoolean('LOG_TRACE'), // TRACE 레벨 로깅 활성화
            logVerbose: getEnvAsBoolean('LOG_VERBOSE'), // 디버그 콘솔에 로그 출력
        }
    }
    updateRegistry({ env });
}

function getEnv(envName: string): string | undefined {
    return process.env[`AFRON_${envName}`];
}
function getEnvAsBoolean(envName: string): boolean {
    const envField = process.env[`AFRON_${envName}`] ?? '';
    return (
        envField === '1' ||
        envField.toUpperCase() == 'TRUE' ||
        envField.toUpperCase() == 'T'
    );
}