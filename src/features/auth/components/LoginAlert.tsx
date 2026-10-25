const tones = {
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
};

// Figma login-card alert. message의 \n은 줄바꿈으로 보인다
export default function LoginAlert({
  tone,
  title,
  message,
}: {
  tone: keyof typeof tones;
  title: string;
  message: string;
}) {
  return (
    <div
      role="alert"
      className={`flex w-full flex-col items-center gap-1.5 rounded-lg px-4.5 py-4 ${tones[tone]}`}
    >
      <p className="text-title-lg">{title}</p>
      <p className="text-body text-fg-secondary text-center whitespace-pre-line">
        {message}
      </p>
    </div>
  );
}
