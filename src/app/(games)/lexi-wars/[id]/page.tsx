import Content from "./_components/content";

export default async function LobbyPlayGround({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id) console.log(id);
  else console.log("No id");

  return <Content id={id} />;
}
