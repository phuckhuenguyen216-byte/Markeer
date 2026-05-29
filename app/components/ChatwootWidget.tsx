"use client";

import { useEffect } from "react";

type ChatwootSDK = {
  run: (config: {
    websiteToken: string;
    baseUrl: string;
    position?: "left" | "right";
    type?: "standard" | "expanded_bubble";
    launcherTitle?: string;
    hideMessageBubble?: boolean;
  }) => void;
};

type ChatwootController = {
  toggle: () => void;
};

type ChatwootSettings = {
  position?: "left" | "right";
  type?: "standard" | "expanded_bubble";
  launcherTitle?: string;
};

declare global {
  interface Window {
    chatwootSDK?: ChatwootSDK;
    $chatwoot?: ChatwootController;
    chatwootSettings?: ChatwootSettings;
    __markeeChatwootInitialized?: boolean;
  }
}

export default function ChatwootWidget() {
  useEffect(() => {
    if (typeof window === "undefined" || window.__markeeChatwootInitialized) {
      return;
    }

    const BASE_URL = "https://crm.smb.markeeai.com";
    const SDK_SRC = `${BASE_URL}/packs/js/sdk.js`;

    window.chatwootSettings = {
      position: "right",
      type: "standard",
      launcherTitle: "",
    };

    const initializeChatwoot = () => {
      if (!window.chatwootSDK || window.__markeeChatwootInitialized) {
        return;
      }

      window.chatwootSDK.run({
        websiteToken: "oBoaPY8grWDTu8KY68jn8m7z",
        baseUrl: BASE_URL,
      });
      window.__markeeChatwootInitialized = true;
    };

    if (window.chatwootSDK) {
      initializeChatwoot();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${SDK_SRC}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeChatwoot, { once: true });
      return () => {
        existingScript.removeEventListener("load", initializeChatwoot);
      };
    }

    const script = document.createElement("script");
    script.src = SDK_SRC;
    script.async = true;
    script.onload = initializeChatwoot;

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(script, firstScriptTag);

    return () => {
      script.removeEventListener("load", initializeChatwoot);
    };
  }, []);

  return null;
}
