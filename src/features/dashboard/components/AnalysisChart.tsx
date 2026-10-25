import { daily } from "../data";

const MAX = 200;
const ticks = [0, 50, 100, 150, 200];
const labelIndexes = [0, 4, 9, 14, 19, 24, 29];

// Figma chart · 최근 30일 AI 분석. 막대 높이는 분석 횟수(0~200) 비율, 빨간 부분이 실패
export default function AnalysisChart() {
  const last = daily.length - 1;
  const today = daily[last];

  return (
    <section className="glass flex flex-1 flex-col gap-3.5 rounded-xl [--glass-from:0.78] [--glass-to:0.4] px-5.25 py-4.75">
      <div className="flex items-center gap-3.5">
        <h2 className="text-title-md flex-1">
          최근 30일 AI 분석 횟수 · 실패율
        </h2>
        <Legend color="bg-forest-500" label="성공" />
        <Legend color="bg-danger" label="실패" />
      </div>
      <div className="relative h-117.5 w-174 shrink-0">
        <div className="absolute inset-y-0 right-0 left-8">
          <div className="absolute inset-x-0 top-2 bottom-7">
            {ticks.map((tick) => (
              <div
                key={tick}
                className="absolute inset-x-0 translate-y-px"
                style={{ bottom: `${(tick / MAX) * 100}%` }}
              >
                <div className="bg-line h-px" />
                <span className="text-caption text-fg-tertiary absolute top-0 right-full w-8 -translate-y-1/2 leading-3.5">
                  {tick}
                </span>
              </div>
            ))}
            <div className="absolute inset-0 flex">
              {daily.map(({ date, total, fail }, i) => {
                const isToday = i === last;
                return (
                  <div
                    key={date}
                    className="relative flex flex-1 items-end px-1"
                  >
                    <div
                      className={`relative w-full rounded-t-sm ${isToday ? "bg-primary" : "bg-moss-500"}`}
                      style={{ height: `${(total / MAX) * 100}%` }}
                    >
                      <div
                        className="bg-danger absolute inset-x-0 top-0 rounded-t-sm"
                        style={{ height: `${(fail / total) * 100}%` }}
                      />
                      {isToday && <Tooltip {...today} />}
                    </div>
                    {labelIndexes.includes(i) && (
                      <span
                        className={`text-caption text-fg-tertiary absolute top-full mt-2 whitespace-nowrap ${isToday ? "right-0" : "left-0"}`}
                      >
                        {date}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`size-2.5 rounded-[0.1875rem] ${color}`} />
      <span className="text-caption text-fg-secondary">{label}</span>
    </div>
  );
}

function Tooltip({
  date,
  total,
  fail,
}: {
  date: string;
  total: number;
  fail: number;
}) {
  return (
    <div className="absolute right-0 bottom-full mb-5.75 w-max">
      <div className="glass flex flex-col gap-0.5 rounded-md [--glass-from:0.94] [--glass-to:0.7] px-2.25 py-1.75">
        <p className="text-label">{date} 오늘</p>
        <p className="text-caption text-fg-secondary">
          분석 {total}회 · 실패 {fail}건 ({((fail / total) * 100).toFixed(1)}%)
        </p>
      </div>
    </div>
  );
}
