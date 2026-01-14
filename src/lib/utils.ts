import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getDeviceId(){
  let deviceId = localStorage.getItem("deviceId");
  
  // 기기 ID가 없거나 'unknown' 같은 이상한 값이면 새로 생성해서 박아버림
  if (!deviceId || deviceId.includes("unknown")) {
    deviceId = crypto.randomUUID(); // 브라우저 내장 UUID 생성기
    localStorage.setItem("deviceId", deviceId);
  }
  
  return deviceId;
}