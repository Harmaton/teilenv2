'use client'

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

const EmbeddedHotmartCheckout = () => {
  useEffect(() => {
    // Function to import the Hotmart script and stylesheet
    const importHotmart = () => {
      if (!document.querySelector("script[src='https://static.hotmart.com/checkout/widget.min.js']")) {
        const script = document.createElement('script');
        script.src = 'https://static.hotmart.com/checkout/widget.min.js';
        script.async = true;
        document.head.appendChild(script);
      }

      if (!document.querySelector("link[href='https://static.hotmart.com/css/hotmart-fb.min.css']")) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
        document.head.appendChild(link);
      }
    };

    // Import Hotmart script and stylesheet
    importHotmart();
  }, []);

  return (
    <div className="flex w-full justify-center">
      <Link
        href="https://pay.hotmart.com/Q93170299N"
        className="hotmart-fb hotmart__button-checkout inline-flex items-center justify-center rounded-lg shadow-md transition-transform duration-150 hover:scale-[1.03] hover:shadow-lg"
        onClick={(e) => e.preventDefault()}
      >
        <Image
          src="https://static.hotmart.com/img/btn-buy-green.png"
          alt="Buy Now"
          width={240}
          height={56}
          style={{ width: "100%", height: "auto" }}
          className="max-w-[260px]"
        />
      </Link>
    </div>
  );
};

export default EmbeddedHotmartCheckout