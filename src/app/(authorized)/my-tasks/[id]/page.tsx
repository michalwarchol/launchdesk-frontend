import MyTaskPlayer from "./MyTaskPlayer";

interface MyTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function MyTaskPage({ params }: MyTaskPageProps) {
  const { id } = await params;

  return <MyTaskPlayer assignmentId={id} />;
}
