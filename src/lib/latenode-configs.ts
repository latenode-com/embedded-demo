/**
 * SDK configuration presets for each showcase page.
 * The `token` and `container` fields are injected at runtime by LatenodeEditor.
 */

export type ConfigPreset = {
  key: string;
  title: string;
  description: string;
  config: Record<string, unknown>;
  codeString: string;
};

export const PRESETS: Record<string, ConfigPreset> = {
  full: {
    key: "full",
    title: "Full Embed",
    description:
      "Default embed with all features visible. Side menu, greetings, and Explore Apps are all turned on. This is what you get out of the box with zero customization.",
    config: {
      allowCookies: true,
      ui: {
        main: { hideSideMenu: false },
        scenarios: {
          hideExploreAppsButton: true,
        },
      },
    },
    codeString: `await sdk.configure({
  allowCookies: true,
  token,
  container: "latenode-embed",
  ui: {
    main: { hideSideMenu: false },
    scenarios: {
      hideExploreAppsButton: true
    }
  }
});`,
  },

  minimal: {
    key: "minimal",
    title: "Minimal Embed",
    description:
      "Stripped-down embed for a focused, integrated feel. Side menu is hidden, empty-state greetings are removed, and Explore Apps is hidden. Perfect for embedding Latenode as a seamless part of your own app.",
    config: {
      allowCookies: true,
      ui: {
        main: {
          hideSideMenu: true,
          documentationURL: "https://documentation.latenode.com/white-label",
        },
        scenarios: {
          hideEmptyScenariosGreetings: true,
          hideExploreAppsButton: true,
        },
      },
    },
    codeString: `await sdk.configure({
  allowCookies: true,
  token,
  container: "latenode-embed",
  ui: {
    main: {
      hideSideMenu: true,
      documentationURL: "https://documentation.latenode.com/white-label"
    },
    scenarios: {
      hideEmptyScenariosGreetings: true,
      hideExploreAppsButton: true
    }
  }
});`,
  },

  branded: {
    key: "branded",
    title: "Custom Theme",
    description:
      "Demonstrates the full theming surface: custom primary color, Google Font (Plus Jakarta Sans), per-type button styles with hover states, input and button border radius, switch colors, scenario canvas background, and node settings panel colors. Shows how to fully align Latenode's look and feel with your brand.",
    config: {
      allowCookies: true,
      ui: {
        main: { hideSideMenu: false },
        scenarios: {
          hideEmptyScenariosGreetings: true,
          hideExploreAppsButton: true,
        },
        theme: {
          font: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            load: {
              googleFontFamily: "Plus Jakarta Sans:wght@400;500;600;700",
            },
          },
          primaryColor: "#0d9488",
          button: {
            primary: {
              default: {
                backgroundColor: "#0d9488",
                textColor: "#ffffff",
                borderColor: "#0d9488",
              },
              hover: {
                backgroundColor: "#0f766e",
                textColor: "#ffffff",
                borderColor: "#0f766e",
              },
              active: {
                backgroundColor: "#115e59",
                textColor: "#ffffff",
                borderColor: "#115e59",
              },
              disabled: {
                backgroundColor: "#99f6e4",
                textColor: "#ffffff",
                borderColor: "#99f6e4",
              },
              borderRadius: "8px",
              borderWidth: "1px",
            },
            default: {
              default: {
                backgroundColor: "#ffffff",
                textColor: "#0d9488",
                borderColor: "#0d9488",
              },
              hover: {
                backgroundColor: "#f0fdfa",
                textColor: "#0f766e",
                borderColor: "#0f766e",
              },
              active: {
                backgroundColor: "#ccfbf1",
                textColor: "#0f766e",
                borderColor: "#0f766e",
              },
              disabled: {
                backgroundColor: "#f9fafb",
                textColor: "#9ca3af",
                borderColor: "#e5e7eb",
              },
              borderRadius: "8px",
              borderWidth: "1px",
            },
          },
          input: {
            borderRadius: "8px",
          },
          switch: {
            checkedBackgroundColor: "#0d9488",
            uncheckedBackgroundColor: "#d1d5db",
          },
          scenario: {
            backgroundColor: "#f0fdfa",
            nodeSettings: {
              headerBgColor: "#0d9488",
              bodyBgColor: "#f0fdfa",
              footerBgColor: "#f0fdfa",
            },
          },
        },
      },
    },
    codeString: `await sdk.configure({
  allowCookies: true,
  token,
  container: "latenode-embed",
  ui: {
    main: { hideSideMenu: false },
    scenarios: {
      hideEmptyScenariosGreetings: true,
      hideExploreAppsButton: true
    },
    theme: {
      font: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        load: {
          googleFontFamily: "Plus Jakarta Sans:wght@400;500;600;700"
        }
      },
      primaryColor: "#0d9488",
      button: {
        primary: {
          default: { backgroundColor: "#0d9488", textColor: "#ffffff", borderColor: "#0d9488" },
          hover:   { backgroundColor: "#0f766e", textColor: "#ffffff", borderColor: "#0f766e" },
          active:  { backgroundColor: "#115e59", textColor: "#ffffff", borderColor: "#115e59" },
          disabled:{ backgroundColor: "#99f6e4", textColor: "#ffffff", borderColor: "#99f6e4" },
          borderRadius: "8px",
          borderWidth: "1px"
        },
        default: {
          default: { backgroundColor: "#ffffff", textColor: "#0d9488", borderColor: "#0d9488" },
          hover:   { backgroundColor: "#f0fdfa", textColor: "#0f766e", borderColor: "#0f766e" },
          active:  { backgroundColor: "#ccfbf1", textColor: "#0f766e", borderColor: "#0f766e" },
          disabled:{ backgroundColor: "#f9fafb", textColor: "#9ca3af", borderColor: "#e5e7eb" },
          borderRadius: "8px",
          borderWidth: "1px"
        }
      },
      input: {
        borderRadius: "8px"
      },
      switch: {
        checkedBackgroundColor: "#0d9488",
        uncheckedBackgroundColor: "#d1d5db"
      },
      scenario: {
        backgroundColor: "#f0fdfa",
        nodeSettings: {
          headerBgColor: "#0d9488",
          bodyBgColor: "#f0fdfa",
          footerBgColor: "#f0fdfa"
        }
      }
    }
  }
});`,
  },

  translations: {
    key: "translations",
    title: "Translations",
    description:
      "Demonstrates German localization using the translations config. Shows how to switch the UI language and override specific text labels inside the embedded editor.",
    config: {
      allowCookies: true,
      ui: {
        main: { hideSideMenu: false },
        scenarios: {
          hideEmptyScenariosGreetings: true,
          hideExploreAppsButton: true,
        },
        translations: {
          currentLng: "de",
          overrides: {
            de: {
              latenode_scenariosPage_allScenariosTitleLabel: "Meine Automatisierungen",
              latenode_scenariosPage_createNewScenarioButtonLabel: "Neues Szenario erstellen",
              latenode_scenariosPage_emptyScenariosStartWithTemplateButtonLabel: "Mit Vorlage starten",
              latenode_scenariosPage_emptyScenariosNoActiveScenariosMessage: "Sie haben noch keine aktiven Szenarien",
              latenode_scenariosPage_importFolderOrScenario: "Ordner oder Szenario importieren",
            },
          },
        },
      },
    },
    codeString: `await sdk.configure({
  allowCookies: true,
  token,
  container: "latenode-embed",
  ui: {
    main: { hideSideMenu: false },
    scenarios: {
      hideEmptyScenariosGreetings: true,
      hideExploreAppsButton: true
    },
    translations: {
      currentLng: "de",
      overrides: {
        de: {
          latenode_scenariosPage_allScenariosTitleLabel: "Meine Automatisierungen",
          latenode_scenariosPage_createNewScenarioButtonLabel: "Neues Szenario erstellen",
          latenode_scenariosPage_emptyScenariosStartWithTemplateButtonLabel: "Mit Vorlage starten",
          latenode_scenariosPage_emptyScenariosNoActiveScenariosMessage: "Sie haben noch keine aktiven Szenarien",
          latenode_scenariosPage_importFolderOrScenario: "Ordner oder Szenario importieren"
        }
      }
    }
  }
});`,
  },

  customMenu: {
    key: "customMenu",
    title: "Custom Menu",
    description:
      "Hides the native Latenode side menu and replaces it with a custom stylized menu rendered by your app. Navigation inside the iframe is driven by sdk.navigate() calls from the host menu.",
    config: {
      allowCookies: true,
      ui: {
        main: {
          hideSideMenu: true,
          documentationURL: "https://documentation.latenode.com/white-label",
        },
        scenarios: {
          hideEmptyScenariosGreetings: true,
          hideExploreAppsButton: true,
        },
      },
    },
    codeString: `// 1. Configure with hideSideMenu: true
await sdk.configure({
  allowCookies: true,
  token,
  container: "latenode-embed",
  ui: {
    main: {
      hideSideMenu: true,
      documentationURL: "https://your-app.example/docs"
    },
    scenarios: {
      hideEmptyScenariosGreetings: true,
      hideExploreAppsButton: true
    }
  },
  navigation: {
    handler: ({ route }) => {
      // Sync your custom menu active state
      setActiveRoute(route);
    }
  }
});

// 2. Navigate from your custom menu:
sdk.navigate({ to: "/scenarios" });

// 3. Create scenarios from your menu:
await sdk.createEmptyScenario("New automation");`,
  },

  templates: {
    key: "templates",
    title: "Templates",
    description:
      "Browse the shared scenario template library. Pick a ready-made automation and use it as a starting point in your workspace.",
    config: {
      allowCookies: true,
    },
    codeString: `await sdk.configure({
  allowCookies: true,
  token,
  container: "latenode-embed"
});

// Navigate to the shared scenarios / templates page:
sdk.navigate({ to: "/shared-scenarios" });`,
  },

  cloneTemplate: {
    key: "cloneTemplate",
    title: "Clone Template",
    description:
      "Demonstrates triggering a clone-template action via sdk.navigate() from a host-app button. The embed is hidden until the action is triggered.",
    config: {
      allowCookies: true,
    },
    codeString: `await sdk.configure({ allowCookies: true, token, container: "latenode-embed" });

// Triggered by the button click:
sdk.navigate({ to: "/run-action?action=clone-template&template-id=69bd0f987e78dbcedb7f095f" });`,
  },

  automation: {
    key: "automation",
    title: "SDK Automation",
    description:
      "Demonstrates programmatic control from the host app. Use the toolbar buttons above the editor to create scenarios, save, deploy, and run — all controlled from your own application code.",
    config: {
      allowCookies: true,
      ui: {
        main: { hideSideMenu: false },
        scenarios: {
          hideEmptyScenariosGreetings: true,
          hideExploreAppsButton: true,
        },
      },
    },
    codeString: `// Configure the SDK
await sdk.configure({
  allowCookies: true,
  token,
  container: "latenode-embed",
  ui: {
    main: { hideSideMenu: false },
    scenarios: {
      hideEmptyScenariosGreetings: true,
      hideExploreAppsButton: true
    }
  }
});

// Then use SDK automation methods:
await sdk.createEmptyScenario("New automation");
await sdk.save();
await sdk.deploy();
await sdk.runOnce();`,
  },
};
