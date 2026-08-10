import { createFileRoute } from '@tanstack/react-router';
import { ServerBuilderProvider, useServerBuilder } from '../context/ServerBuilderContext';
import { ServerBuilderLayout } from '../components/server-builder/Layout';
import { Step1Category } from '../components/server-builder/steps/Step1Category';
import { Step2ServerType } from '../components/server-builder/steps/Step2ServerType';
import { Step3Requirements } from '../components/server-builder/steps/Step3Requirements';
import { Step4Addons } from '../components/server-builder/steps/Step4Addons';
import { Step5Review } from '../components/server-builder/steps/Step5Review';

export const Route = createFileRoute('/build-server')({
  component: ServerBuilderPage,
});

function Wizard() {
    const { state } = useServerBuilder();
    
    return (
        <ServerBuilderLayout>
            {state.currentStep === 1 && <Step1Category />}
            {state.currentStep === 2 && <Step2ServerType />}
            {state.currentStep === 3 && <Step3Requirements />}
            {state.currentStep === 4 && <Step4Addons />}
            {state.currentStep === 5 && <Step5Review />}
        </ServerBuilderLayout>
    );
}

function ServerBuilderPage() {
  return (
    <ServerBuilderProvider>
      <Wizard />
    </ServerBuilderProvider>
  );
}
