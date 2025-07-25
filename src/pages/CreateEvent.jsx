import { useState } from 'react';
import '../styles/createEvent.css';
import CreateDetails from '../components/CreateEvent/CreateDetails';
import CreateBanner from '../components/CreateEvent/CreateBanner';
import Preview from '../components/CreateEvent/Preview';

const CreateEvent = () => {
  const [step, setStep] = useState(0);
  const steps = ['Details', 'Banner', 'Preview'];

  const goNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return <CreateDetails onContinue={goNext} />;
      case 1:
        return <CreateBanner onContinue={goNext} onBack={goBack} />;
      case 2:
        return <Preview onBack={goBack} />;
      default:
        return null;
    }
  };

  return (
    <section className="create-event-page">
      <h2>Create a New Event</h2>

      <div className="steps">
        {steps.map((label, index) => (
          <div
            key={index}
            className={`step ${index === step ? 'active' : index < step ? 'done' : ''}`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="step-content">{renderStepComponent()}</div>
    </section>
  );
};

export default CreateEvent;
