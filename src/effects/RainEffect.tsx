import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import type { Container, Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';

const RainEffect: React.FC = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        // Container loaded
    }, []);

    return (
        <Particles
            id="rainParticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fullScreen: {
                    enable: true,
                    zIndex: 1
                },
                particles: {
                    number: {
                        value: 100,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: "#0066cc"
                    },
                    shape: {
                        type: "circle"
                    },
                    opacity: {
                        value: 0.6
                    },
                    size: {
                        value: 4,
                        random: false
                    },
                    move: {
                        enable: true,
                        speed: 15,
                        direction: "bottom",
                        straight: true,
                        outModes: {
                            default: "out"
                        }
                    }
                },
                emitters: {
                    position: {
                        x: 50,
                        y: 0
                    },
                    rate: {
                        delay: 0.1,
                        quantity: 2
                    },
                    size: {
                        width: 100,
                        height: 0
                    }
                }
            }}
        />
    );
};

export default RainEffect; 