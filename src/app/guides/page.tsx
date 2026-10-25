import { Suspense } from "react";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import TopBar from "@/components/TopBar";
import AppCardPreview from "@/features/guides/components/AppCardPreview";
import GuideEditor from "@/features/guides/components/GuideEditor";
import SpeciesList from "@/features/guides/components/SpeciesList";
import { guides } from "@/features/guides/data";

export default function GuidesPage({ searchParams }: PageProps<"/guides">) {
  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col gap-4">
        <TopBar title="사육 가이드" />
        <Suspense>
          <GuidesContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

// ?state=empty(W-4b) | editing(W-4e) | confirm(W-4a) | saved(W-4c) | failed(W-4f), 없으면 W-4
async function GuidesContent({
  searchParams,
}: Pick<PageProps<"/guides">, "searchParams">) {
  const { state } = await searchParams;
  const empty = state === "empty";
  const dirty =
    state === "editing" || state === "confirm" || state === "failed";

  const guide = guides.find(
    (g) => g.id === (empty ? "gargoyle-gecko" : "leopard-gecko"),
  )!;
  const content = dirty
    ? {
        ...guide.content,
        먹이: `${guide.content.먹이} 칼슘 파우더를 묻혀 주세요.`,
      }
    : guide.content;

  return (
    <div className="flex flex-1 gap-4 p-2">
      <SpeciesList selectedId={guide.id} />
      <GuideEditor
        name={guide.name}
        content={content}
        status={dirty ? "dirty" : empty ? "empty" : "saved"}
        updatedAt={state === "saved" ? "2026.10.24" : guide.updatedAt}
        activeSection={dirty ? "먹이" : undefined}
      />
      <AppCardPreview name={guide.name} content={content} />
      {state === "confirm" && (
        <Dialog
          title="저장하지 않은 내용이 있어요"
          message={
            <>
              크레스티드 게코로 바꾸면 레오파드 게코 가이드에서
              <br />
              고친 내용이 사라져요.
            </>
          }
        >
          <Button variant="ghost">계속 편집</Button>
          <Button variant="danger">저장 안 하고 이동</Button>
        </Dialog>
      )}
      {state === "saved" && (
        <Toast tone="success" position="top" className="w-55.75">
          레오파드 게코 가이드를 저장했어요
        </Toast>
      )}
      {state === "failed" && (
        <Toast position="top" className="w-65.75">
          저장하지 못했어요 · 고친 내용은 그대로예요
        </Toast>
      )}
    </div>
  );
}
