
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine as ParticlesEngine } from "tsparticles-engine";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: ParticlesEngine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "#000000"
          },
          opacity: 0.7
        },
        fpsLimit: 120,
        particles: {
          color: {
            value: "#00ff00"
          },
          links: {
            color: "#00ff00",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce"
            },
            random: true,
            speed: 3,
            straight: false,
            trail: {
              enable: true,
              length: 5,
              fillColor: "#000000"
            }
          },
          number: {
            density: {
              enable: true,
              area: 800
            },
            value: 150
          },
          opacity: {
            value: 0.5,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1
            }
          },
          shape: {
            type: "circle"
          },
          size: {
            value: { min: 1, max: 5 },
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 0.1
            }
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 1
            }
          }
        },
        detectRetina: true,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab"
            },
            onClick: {
              enable: true,
              mode: "push"
            }
          },
          modes: {
            grab: {
              distance: 180,
              links: {
                opacity: 0.7,
                color: "#00ff00"
              }
            },
            push: {
              quantity: 6
            }
          }
        }
      }}
      className="absolute inset-0 -z-10"
    />
  );
};

export default ParticlesBackground;
