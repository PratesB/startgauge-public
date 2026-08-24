import NewIdeaHeader from "./_components/NewIdeaHeader";
import NewIdeaForm from "./_components/NewIdeaForm";

export default function NewIdeaPage() {
  return (
    <div className="max-w-3xl mx-auto w-full pb-20 pt-8">
      <NewIdeaHeader />
      <NewIdeaForm />
    </div>
  );
}
