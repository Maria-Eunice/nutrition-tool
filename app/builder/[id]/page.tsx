"use client";
import { useParams } from "next/navigation";
import { RecipeBuilderView } from "@/views/RecipeBuilderView";
export default function EditBuilderPage() {
  const { id } = useParams<{ id: string }>();
  return <RecipeBuilderView editId={id} />;
}
