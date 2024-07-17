

import { Footer } from "flowbite-react";

const AppFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div className="flex mt-0 -mb-10">
      <div className="flex-grow">{/* Your main content goes here */}</div>
      <Footer container className="mt-auto ">
        <Footer.Copyright
          by="Made With 💓 by GitanshuGautam"
          year={year}
        />
        
      </Footer>
    </div>
  );
}

export default AppFooter;