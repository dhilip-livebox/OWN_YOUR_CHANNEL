import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/solutions/SolutionPage";
import { solutions } from "@/data/solutions";

export const Route = createFileRoute("/solutions/$id")({
  head: (ctx) => {
    // Attempt to dynamically find the title for meta tags
    const solId = ctx.params.id;
    const solution = solutions.find((s) => s.id === solId);
    return {
      meta: [
        { title: `${solution ? solution.title : 'Solution'} - AI LiveTV` },
        {
          name: "description",
          content: solution ? solution.whatIsIt : "Explore our media broadcasting solutions.",
        },
      ],
    };
  },
  component: SolutionRoute,
});

function SolutionRoute() {
  const { id } = Route.useParams();
  return <SolutionPage id={id} />;
}
