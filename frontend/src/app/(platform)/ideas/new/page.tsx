import NewIdeaHeader from "./_components/NewIdeaHeader";
import NewIdeaForm from "./_components/NewIdeaForm";

export default function NewIdeaPage() {
  return (
    <div className="max-w-4xl mx-auto w-full pb-20 relative">
      {/* Decorative background blur */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-60 right-0 w-96 h-96 bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <NewIdeaHeader />
      <NewIdeaForm />
    </div>
  );
}
