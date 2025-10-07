import ReactGA from 'react-ga';

const useGAEventsTracker = (category = 'Event Category') => {
  const trackEvent = (action = 'action', label = 'label') => {
    if (window.location.origin.toLocaleLowerCase() === 'https://toyotaautoshow.com') {
      ReactGA.event({ category, action, label });
    }
  };
  return trackEvent;
};

export default useGAEventsTracker;
