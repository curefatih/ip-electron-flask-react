import * as React from 'react';
import './App.scss';
import Button from './components/Button/Button';
import Accordion from './components/Accordion/Accordion';
import Input from './components/Input/Input';
import Dragable from './components/Dragable/Dragable';
import ImgContainer from './components/ImgContainer/ImgContainer';
declare global {
  interface Window { ipcRenderer: any; }
}

const ipcRenderer = window.ipcRenderer || {}
const videoURL = 'http://127.0.0.1:5001/video_feed';

function App() {
  const contentRef = React.useRef(null);

  const [states, setStates] = React.useState({
    showVideo: false,
    showedVideoURL: "",
    loadingInitialImage: "",
    initialImage: "",
    initialImageSize: {
      width: 0,
      height: 0
    },
    processedImgSize: {
      width: 0,
      height: 0
    },
    currentDisplay: "INITIAL",
    processedImgSrc: ""
  })

  const [transform, setTransform] = React.useState({
    angle: 45,
    resize: false,
    center: [0, 0]
  })

  const [swirl, setSwirl] = React.useState({
    center: [0, 0],
    strength: 0,
    radius: 0,
    rotation: 0
  })

  const [houghCircle, setHoughCircle] = React.useState({
    radius: 0,
    normalize: false,
    full_output: false
  })

  const [downscale, setDownscale] = React.useState({
    cval: 0,
    clip: true,
    factors: [1, 1, 1]
  })

  const [eqHist, setEqHist] = React.useState({
    bins: 256
  })

  const [gamma, setGamma] = React.useState({
    gamma: 1,
    gain: 1
  })

  const [equalizeAdaptHist, setEqualizeAdaptHist] = React.useState({
    kernel_size: 0,
    clip_limit: 0.01,
    nbins: 256
  })

  React.useEffect(() => {

    ipcRenderer.on('openFile', (event: any, base64: string) => {
      setStates({
        ...states,
        initialImage: base64.toString()
      })
    })

    ipcRenderer.on('rotate', (event: any, base64: string) => {
      setStates({
        ...states,
        currentDisplay: "ROTATE",
        initialImage: base64.toString()
      })
    })

    ipcRenderer.on('swirl', (event: any, base64: string) => {
      setStates({
        ...states,
        currentDisplay: "SWIRL",
        initialImage: base64.toString()
      })
    })

    ipcRenderer.on('gamma', (event: any, base64: string) => {
      setStates({
        ...states,
        currentDisplay: "GAMMA",
        initialImage: base64.toString()
      })
    })

    ipcRenderer.on('equalize_adapthist', (event: any, base64: string) => {
      setStates({
        ...states,
        currentDisplay: "EQ_ADAPT_HIST",
        initialImage: base64.toString()
      })
    })

    ipcRenderer.on('eq_hist', (event: any, base64: string) => {
      setStates({
        ...states,
        currentDisplay: "EQ_HIST",
        initialImage: base64.toString()
      })
    })


    /*****************************not working */

    ipcRenderer.on('integral_image', (event: any, base64: string) => {

      console.log(base64);

      setStates({
        ...states,
        currentDisplay: "INTEGRAL",
        initialImage: base64.toString()
      })
    })

    ipcRenderer.on('downscale', (event: any, base64: string) => {

      console.log(base64);

      setStates({
        ...states,
        currentDisplay: "DOWNSCALE",
        initialImage: base64.toString()
      })
    })





  }, [])

  const handleRotate = () => {
    ipcRenderer.send('rotate', { args: transform, image: states.initialImage })
  }

  const handleSwirlButtonClick = () => {
    ipcRenderer.send('swirl', { args: swirl, image: states.initialImage })
  }

  const handleHoughCircleButtonClick = () => {
    ipcRenderer.send('hough_circle', { args: houghCircle, image: states.initialImage })
  }

  const handleIntegralButtonClick = () => {
    ipcRenderer.send('integral_image', { image: states.initialImage })
  }

  const handleDownscaleButtonClick = () => {
    ipcRenderer.send('downscale', { args: downscale, image: states.initialImage })
  }

  const handleEqHistButtonClick = () => {
    ipcRenderer.send('eq_hist', { args: eqHist, image: states.initialImage })
  }

  const handleGammaButtonClick = () => {
    ipcRenderer.send('gamma', { args: gamma, image: states.initialImage })
  }

  const handleEqAdaptHistButtonClick = () => {
    ipcRenderer.send('equalize_adapthist', { args: equalizeAdaptHist, image: states.initialImage })
  }

  return (
    <div
      className="App"
    >

      <div
        className="content columns"
        ref={contentRef}
      >

        <div className="column is-four-fifths canvas_wrapper">
          <div
            id="canvas_container"

          >
            <ImgContainer
              src={states.showedVideoURL}
              className={states.showVideo ? "show" : "hide"}
            />

            {states.showVideo ? null
              :
              <>
                {states.initialImage !== "" ?
                  <><ImgContainer
                    src={'data:image/jpg;base64,' + states.initialImage}
                    onLoad={function (e: any) {
                      setStates({
                        ...states,
                        initialImageSize: {
                          width: e.target.naturalWidth,
                          height: e.target.naturalHeight
                        }
                      })
                      const center = [Math.floor(e.target.naturalWidth / 2), Math.floor(e.target.naturalHeight / 2)]
                      setTransform({
                        ...transform,
                        center
                      })
                      setSwirl({
                        ...swirl,
                        center
                      })
                    }}
                  />
                  </> : null
                }

                {states.processedImgSrc !== "" ?
                  <ImgContainer
                    src={'data:image/jpg;base64,' + states.processedImgSrc}
                    onLoad={function (e: any) {
                      setStates({
                        ...states,
                        processedImgSize: {
                          width: e.target.naturalWidth,
                          height: e.target.naturalHeight
                        }
                      })
                    }} /> : null
                }
              </>
            }
          </div>

          {!states.showVideo ?
            <Dragable
              showInstruction={states.initialImage === "" && !states.showVideo}
              onDrop={(e) => {
                //@ts-expect-error
                window.ipcRenderer.send('openFile', e.dataTransfer.files[0].path)
              }} />
            : null}
        </div>

        <div className="column side_menu">
          <Accordion title="Görüntü iyileştirme">
            123
         </Accordion>

          <Accordion title="Histogram Görüntüleme ve Eşitleme">
            <div className="eq_hist">
              <div className="options mb-3">

                <div className="bins option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Bins</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      min="1"
                      max="180"
                      value={eqHist.bins}
                      onChange={(e) => setEqHist({ ...eqHist, bins: parseInt(e.target.value) })} />
                  </div>
                </div>


              </div>
              <Button
                className="secondary"
                onClick={handleEqHistButtonClick}
              >Equalize Histogram</Button>
            </div>

          </Accordion>

          <Accordion title="Uzaysal Dönüşüm ve Eşitleme">
            <div className="rotate">
              <div className="options mb-3">
                <div className="center option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Center</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={transform.center[0]}
                      onChange={(e) => setTransform({ ...transform, center: [parseInt(e.target.value), transform.center[1]] })} />
                    <Input
                      placeholder="y"
                      type="number"
                      value={transform.center[1]}
                      id="rotate_center_y"
                      onChange={(e) => setTransform({ ...transform, center: [transform.center[0], parseInt(e.target.value)] })} />
                  </div>
                </div>
                <div className="angle option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Angle</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      min="1"
                      max="180"
                      value={transform.angle}
                      onChange={(e) => setTransform({ ...transform, angle: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="angle option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Resize</h6>
                  </div>
                  <div className="inputs column">
                    <input
                      type="checkbox"
                      onChange={(e) => setTransform({ ...transform, resize: e.target.checked })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleRotate}
              >Rotate</Button>
            </div>

            <div className="swirl">
              <div className="options mb-3">
                <div className="center option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Center</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={swirl.center[0]}
                      onChange={(e) => setSwirl({ ...swirl, center: [parseInt(e.target.value), swirl.center[1]] })} />
                    <Input
                      placeholder="y"
                      type="number"
                      value={swirl.center[1]}
                      id="rotate_center_y"
                      onChange={(e) => setSwirl({ ...swirl, center: [swirl.center[0], parseInt(e.target.value)] })} />
                  </div>
                </div>
                <div className="strength option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Strength</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={swirl.strength}
                      onChange={(e) => setSwirl({ ...swirl, strength: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="radius option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Radius</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={swirl.radius}
                      onChange={(e) => setSwirl({ ...swirl, radius: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="rotation option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Rotation</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={swirl.rotation}
                      onChange={(e) => setSwirl({ ...swirl, rotation: parseInt(e.target.value) })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleSwirlButtonClick}
              >Swirl</Button>
            </div>

            <div className="hough_circle">
              <div className="options mb-3">

                <div className="radius option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Radius</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={houghCircle.radius}
                      onChange={(e) => setHoughCircle({ ...houghCircle, radius: parseFloat(e.target.value) })} />
                  </div>
                </div>

                <div className="hough_normalize option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Normalize</h6>
                  </div>
                  <div className="inputs column">
                    <input
                      type="checkbox"
                      onChange={(e) => setHoughCircle({ ...houghCircle, normalize: e.target.checked })} />
                  </div>
                </div>

                <div className="full_output option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Full output</h6>
                  </div>
                  <div className="inputs column">
                    <input
                      type="checkbox"
                      onChange={(e) => setHoughCircle({ ...houghCircle, full_output: e.target.checked })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleHoughCircleButtonClick}
              >Hough Circle</Button>
            </div>

            <div className="integral">
              <Button
                className="secondary"
                onClick={handleIntegralButtonClick}
              >Integral Image</Button>
            </div>

            <div className="downscale">
              <div className="options mb-3">
                <div className="factors option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Factors</h6>
                  </div>
                  <div className="inputs column">
                    x<Input
                      placeholder="x"
                      type="number"
                      value={downscale.factors[0]}
                      onChange={(e) => setDownscale({ ...downscale, factors: [parseInt(e.target.value), downscale.factors[1]] })} />
                    y<Input
                      placeholder="y"
                      type="number"
                      value={downscale.factors[1]}
                      id="rotate_center_y"
                      onChange={(e) => {
                        setDownscale({ ...downscale, factors: [downscale.factors[0], parseInt(e.target.value)] })
                      }} />
                  </div>
                </div>
                <div className="cval option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Cval</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      min="1"
                      max="180"
                      value={downscale.cval}
                      onChange={(e) => setDownscale({ ...downscale, cval: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="clip option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Clip</h6>
                  </div>
                  <div className="inputs column">
                    <input
                      type="checkbox"
                      onChange={(e) => setDownscale({ ...downscale, clip: e.target.checked })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleDownscaleButtonClick}
              >Downscale</Button>
            </div>

          </Accordion>





          <Accordion title="Yoğunluk Dönüşüm İşlemleri">


            <div className="gamma">
              <div className="options mb-3">

                <div className="gamma option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Gamma</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={gamma.gamma}
                      onChange={(e) => setGamma({ ...gamma, gamma: parseFloat(e.target.value) })} />
                  </div>
                </div>


                <div className="gamma option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Gain</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={gamma.gain}
                      onChange={(e) => setGamma({ ...gamma, gain: parseFloat(e.target.value) })} />
                  </div>
                </div>


              </div>
              <Button
                className="secondary"
                onClick={handleGammaButtonClick}
              >Gamma</Button>
            </div>


            <div className="eq_adaphist">
              <div className="options mb-3">

                <div className="clip_limit option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Kernel_size</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="None"
                      type="number"
                      value={equalizeAdaptHist.kernel_size || ""}
                      onChange={(e) => setEqualizeAdaptHist({ ...equalizeAdaptHist, kernel_size: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="clip_limit option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Clip_limit</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={equalizeAdaptHist.clip_limit}
                      onChange={(e) => setEqualizeAdaptHist({ ...equalizeAdaptHist, clip_limit: parseFloat(e.target.value) })} />
                  </div>
                </div>

                <div className="nbins option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Nbins</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={equalizeAdaptHist.nbins}
                      onChange={(e) => setEqualizeAdaptHist({ ...equalizeAdaptHist, nbins: parseInt(e.target.value) })} />
                  </div>
                </div>


              </div>
              <Button
                className="secondary"
                onClick={handleEqAdaptHistButtonClick}
              >Equalize Adapt Histogram(CLAHE)</Button>
            </div>

          </Accordion>

          <Button
            className="primary"
            onClick={() => {
              setStates({
                ...states,
                showVideo: !states.showVideo,
                showedVideoURL: !states.showVideo ? videoURL : ""
              })
            }}
          >
            Videoda kenar belirleme
            </Button>

        </div>


      </div>
    </div>
  );
}

export default App;
