import React from 'react';

 function Copyright() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between m-10 text-white bg-slate-800 p-6 md:p-10 space-y-4 md:space-y-0 w-vw">
      
      <div className="text-center md:text-left mx-auto md:mx-0">2023 Room. All Rights Reserved</div>

      <div className="text-center md:text-right mx-auto md:mx-0">
        <a href="/privacy-policy" className="mr-4" aria-label="Privacy Policy">Privacy Policy</a>
        <a href="/legal-notice" className="mr-4" aria-label="Legal Notice">Legal Notice</a>
        <a href="/terms-of-use" aria-label="Terms of Use">Terms of Use</a>
      </div>

    </div>
  );
}
export default Copyright;