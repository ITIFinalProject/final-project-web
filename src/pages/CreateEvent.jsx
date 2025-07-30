// import { useState } from 'react';
// import '../styles/createEvent.css';
// import CreateDetails from '../components/CreateEvent/CreateDetails';
// import CreateBanner from '../components/CreateEvent/CreateBanner';
// import Preview from '../components/CreateEvent/Preview';

// const CreateEvent = () => {
//   const [step, setStep] = useState(0);
//   const steps = ['Details', 'Banner', 'Preview'];

//   const goNext = () => {
//     if (step < steps.length - 1) setStep(step + 1);
//   };

//   const goBack = () => {
//     if (step > 0) setStep(step - 1);
//   };
//   const [eventData, setEventData] = useState(null);

//   const handleDetailsSubmit = (data) => {
//     setEventData(prev => ({ ...prev, ...data }));
//     goNext();
//   };
//   const handleBannerUpload = (imageUrl) => {
//     setEventData(prev => ({ ...prev, image: imageUrl }));
//     goNext(); // move to Preview step
//   };

//   const renderStepComponent = () => {
//     switch (step) {
//       case 0:
//         return <CreateDetails onContinue={handleDetailsSubmit} />;
//       case 1:
//         return <CreateBanner onContinue={handleBannerUpload} onBack={goBack} />;
//       case 2:
//         return <Preview onBack={goBack} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <section className="create-event-page">
//       <h2>Create a New Event</h2>

//       <div className="steps">
//         {steps.map((label, index) => (
//           <div
//             key={index}
//             className={`step ${index === step ? 'active' : index < step ? 'done' : ''}`}
//           >
//             {label}
//           </div>
//         ))}
//       </div>

//       <div className="step-content">{renderStepComponent()}</div>
//     </section>
//   );
// };

// export default CreateEvent;





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

  const [eventData, setEventData] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [latlng, setLatlng] = useState({});

  const handleDetailsSubmit = (data) => {
    setEventData(prev => ({ ...prev, ...data }));
    goNext();
  };
  const handlelatlng = (data) => {
    setLatlng(data);
  };
  const handleBannerUpload = (uploadedUrl) => {
    setImageUrl(uploadedUrl);
    setEventData(prev => ({ ...prev, bannerUrl: uploadedUrl }));
    goNext();
  };

  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return <CreateDetails onContinue={handleDetailsSubmit}  latlng={handlelatlng}/>;
      case 1:
        return (
          <CreateBanner
            imageUrl={imageUrl}
            setImageUrl={handleBannerUpload}
            onContinue={() => handleBannerUpload(imageUrl)}
            onBack={goBack}
          />
        );
      case 2:
        return <Preview eventData={eventData} onBack={goBack} latlng={latlng}/>;
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




