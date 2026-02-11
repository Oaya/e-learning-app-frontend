import PlanCard from "../../components/ui/PlanCard";
import { usePlans } from "../../hooks/usePlans";

//Set up a color map for plans to ensure consistent styling
const planColorMap: Record<string, string> = {
  basic: "bg-theme-purple-10",
  standard: "bg-theme-pink-20",
  premium: "bg-theme-yellow-20",
};

export default function PricingPage() {
  const { plans, isLoading, isError } = usePlans();

  if (isLoading) return <div>Loading plans...</div>;
  if (isError) return <div>Error loading plans.</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold">
          Run your own online course platform
        </h2>
        <p className="mb-10 max-w-xl text-gray-600">
          Create and sell courses, manage students, and track progress with our
          all-in-one solution designed for educators and institutions.
        </p>

        <section className="pt-10">
          <h1 className="text-2xl">
            Select the Plan that you are are interested!
          </h1>

          {plans && (
            <div className="flex justify-center gap-10 pt-8">
              {plans.map((plan) => {
                return (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    bgColor={planColorMap[plan.name]}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
