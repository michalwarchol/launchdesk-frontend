const manifest = {
  entries: [],
};

export function GET() {
  return Response.json(manifest);
}
