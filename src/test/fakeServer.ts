import axios, {
  AxiosError,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import { api } from "@/lib/api";

// 테스트용 가짜 서버. 요청마다 [상태 코드, data]를 돌려준다
type Handler = (config: InternalAxiosRequestConfig) => [number, unknown];

let handler: Handler = () => [500, {}];
export const requests: InternalAxiosRequestConfig[] = [];

export function setServer(next: Handler) {
  handler = next;
  requests.length = 0;
}

const adapter: AxiosAdapter = async (config) => {
  requests.push(config);
  const [status, data] = handler(config);
  const response = { status, data, statusText: "", headers: {}, config };
  if (status >= 400) {
    throw new AxiosError("fail", undefined, config, null, response);
  }
  return response;
};
// 재발급은 api 인스턴스가 아니라 axios로 보내서 둘 다 바꾼다
api.defaults.adapter = adapter;
axios.defaults.adapter = adapter;

export const sent = (url: string) => requests.filter((r) => r.url === url);
