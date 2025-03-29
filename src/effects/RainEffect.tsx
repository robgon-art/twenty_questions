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
                    color: {
                        value: "#00aaff"
                    },
                    shape: {
                        type: "char",
                        options: {
                            char: {
                                value: "|",
                                font: "Verdana",
                                style: "",
                                weight: "bold",
                            }
                        }
                    },
                    opacity: {
                        value: 0.7
                    },
                    size: {
                        value: 16, // visually longer
                        random: false
                    },
                    move: {
                        enable: true,
                        speed: {
                            min: 23,
                            max: 27
                        },
                        direction: "bottom",
                        straight: true,
                        outModes: {
                            default: "destroy"
                        }
                    }
                },
                emitters: {
                    position: {
                        x: 50,
                        y: 0
                    },
                    rate: {
                        delay: 0.03,
                        quantity: 16
                    },
                    size: {
                        width: 1000,
                        height: 0
                    }
                }
            }}
        />
    );
};

export default RainEffect;
