import * as React from 'react';
import './App.scss';
import Button from './components/Button/Button';
import Accordion from './components/Accordion/Accordion';
import Input from './components/Input/Input';
import Dragable from './components/Dragable/Dragable';
import ImgContainer from './components/ImgContainer/ImgContainer';
import ImageViewer from './components/ImageViewer/ImageViewer';
import ErrorPop from './components/ErrorPop/ErrorPop';
import Loading from './components/Loading/Loading';

import cx from 'classnames';
declare global {
  interface Window { ipcRenderer: any; }
}

const ipcRenderer = window.ipcRenderer || {}
const videoURL = 'http://127.0.0.1:5001/video_feed';
function isBase64(str: string) {
  if (str === '' || str.trim() === '') { return false; }
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
}
function App() {
  const contentRef = React.useRef(null);

  const [states, setStates] = React.useState({
    showVideo: false,
    showedVideoURL: "",
    isLoading: false,
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
    processedImgSrc: "",
    warningMessage: "",
    showWarningMessage: false
  })

  const [histogramModal, setHistogramModal] = React.useState({
    showHistogramModal: false,
    histogramImageData: ""
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

  const [windowFilter, setWindow] = React.useState({
    window_type: "hann"
  })

  const [crop, setCrop] = React.useState({
    x: [0, 0],
    y: [0, 0]
  })

  const [resize, setResize] = React.useState({
    output_shape: [0, 0]
  })

  const [affineTransform, setAffineTransform] = React.useState({
    scale: 0,
    rotation: 0,
    shear: 0,
    translation: [0, 0]
  })

  const dataOrError = React.useCallback((str, type) => {
    const data: string = str.toString()
    if (isBase64(data)) {
      setStates({
        ...states,
        isLoading: false,
        currentDisplay: type,
        initialImage: data
      })
    } else {
      setStates({
        ...states,
        isLoading: false,
        warningMessage: str,
        showWarningMessage: true
      })
    }
  }, [])

  React.useEffect(() => {

    ipcRenderer.on('openFile', (event: any, base64: string) => {
      setStates({
        ...states,
        initialImage: base64.toString()
      })
    })

    ipcRenderer.on('rotate', (event: any, base64: string) => {
      dataOrError(base64, "ROTATE")
    })

    ipcRenderer.on('swirl', (event: any, base64: string) => {
      dataOrError(base64, "SWIRL")
    })

    ipcRenderer.on('gamma', (event: any, base64: string) => {
      dataOrError(base64, "GAMMA")
    })

    ipcRenderer.on('equalize_adapthist', (event: any, base64: string) => {
      dataOrError(base64, "EQ_ADAPT_HIST")
    })

    ipcRenderer.on('eq_hist', (event: any, base64: string) => {
      dataOrError(base64, "EQ_HIST")
    })

    ipcRenderer.on('show_histogram', (event: any, base64: string) => {
      // setStates({ ...states, isLoading: false })
      const data = base64.toString()
      if (isBase64(data))
        setHistogramModal({
          ...histogramModal,
          showHistogramModal: true,
          histogramImageData: 'data:image/png;base64,' + base64.toString()
        })
    })

    ipcRenderer.on('window', (event: any, base64: string) => {
      dataOrError(base64, "WINDOW")
    })

    ipcRenderer.on('median', (event: any, base64: string) => {
      dataOrError(base64, "MEDIAN")
    })

    ipcRenderer.on('crop', (event: any, base64: string) => {
      dataOrError(base64, "CROP")
    })

    ipcRenderer.on('resize', (event: any, base64: string) => {
      dataOrError(base64, "RESIZE")
    })

    /*****************************not working */


    /***************************** in progress */

    ipcRenderer.on('affine_transform', (event: any, base64: string) => {
      dataOrError(base64, "AFFINE_TRANSFORM")
    })

  }, [])

  React.useEffect(() => {
    console.log(states);

  }, [states])

  const handleRotate = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('rotate', { args: transform, image: states.initialImage })
  }

  const handleSwirlButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('swirl', { args: swirl, image: states.initialImage })
  }

  const handleEqHistButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('eq_hist', { args: eqHist, image: states.initialImage })
  }

  const handleGammaButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('gamma', { args: gamma, image: states.initialImage })
  }

  const handleEqAdaptHistButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('equalize_adapthist', { args: equalizeAdaptHist, image: states.initialImage })
  }

  const handleShowHistogramButtonClick = () => {
    // setStates({ ...states, isLoading: true })
    ipcRenderer.send('show_histogram', { image: states.initialImage })
  }

  const handleWindowButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('window', { args: windowFilter, image: states.initialImage })
  }

  const handleMedianButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('median', { args: {}, image: states.initialImage })
  }

  const handleCropButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('crop', { args: crop, image: states.initialImage })
  }

  const handleResizeButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('resize', { args: resize, image: states.initialImage })
  }

  const handleAffineTransformButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('affine_transform', { args: affineTransform, image: states.initialImage })
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

                      setResize({
                        ...resize,
                        output_shape: [e.target.naturalHeight, e.target.naturalWidth]
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
                if (e.dataTransfer.files[0] && e.dataTransfer.files[0].path)
                  //@ts-expect-error
                  window.ipcRenderer.send('openFile', e.dataTransfer.files[0].path)
              }} />
            : null}


          <ImageViewer
            show={histogramModal.showHistogramModal}
            src={histogramModal.histogramImageData}
            onClose={() => setHistogramModal({ ...histogramModal, showHistogramModal: false })}
          />
        </div>

        <div className="column side_menu">
          <Accordion title="Görüntü iyileştirme">
            <div className="window">
              <div className="options mb-3">

                <div className="window_type option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Window_type</h6>
                  </div>
                  <div className="inputs column">
                    <select onChange={(e) => setWindow({ ...windowFilter, window_type: e.target.value })}>
                      <option value="boxcar">boxcar</option>
                      <option value="triang">triang</option>
                      <option value="blackman">blackman</option>
                      <option value="hamming">hamming</option>
                      <option value="hann">hann</option>
                      <option value="bartlett">bartlett</option>
                      <option value="flattop">flattop</option>
                      <option value="parzen">parzen</option>
                      <option value="bohman">bohman</option>
                      <option value="blackmanharris">blackmanharris</option>
                      <option value="nuttall">nuttall</option>
                      <option value="barthann">barthann</option>
                    </select>
                  </div>
                </div>

                <div className="shape option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Shape</h6>
                  </div>
                  <div className="inputs column">
                    <p>*görüntü "shape" değeri kullanılıyor.</p>
                  </div>
                </div>

                <div className="kwargs option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Warp_kwargs</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleWindowButtonClick}
              >Window</Button>
            </div>

            <div className="median">
              <div className="options mb-3">

                <div className="window_type option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Selem</h6>
                  </div>
                  <div className="inputs column">
                    <p>*'ball(5)' kullanılıyor.</p>
                  </div>
                </div>

                <div className="out option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Out</h6>
                  </div>
                  <div className="inputs column">
                    <p>*görüntü "dtype" değeri kullanılıyor.</p>
                  </div>
                </div>

                <div className="mode option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mode</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

                <div className="cval option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Cval</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

                <div className="behaviour option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Behaviour</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleMedianButtonClick}
              >Median</Button>
            </div>



          </Accordion>

          <Accordion title="Histogram Görüntüleme ve Eşitleme">

            <div className="show_eq_hist">
              <div className="options mb-3">
              </div>
              <Button
                className="secondary"
                onClick={handleShowHistogramButtonClick}
              >Show Histogram</Button>
            </div>

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

            <div className="crop">
              <div className="options mb-3">

                <div className="x_from option columns">
                  <div className="option_title column has-text-centered">
                    <h6>x_from</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={crop.x[0]}
                      onChange={(e) => setCrop({ ...crop, x: [parseInt(e.target.value), crop.x[1]] })} />
                  </div>
                </div>

                <div className="x_to option columns">
                  <div className="option_title column has-text-centered">
                    <h6>x_from</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={crop.x[1]}
                      onChange={(e) => setCrop({ ...crop, x: [crop.x[0], parseInt(e.target.value)] })} />
                  </div>
                </div>

                <div className="y_from option columns">
                  <div className="option_title column has-text-centered">
                    <h6>y_from</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="y_from"
                      type="number"
                      value={crop.y[0]}
                      onChange={(e) => setCrop({ ...crop, y: [parseInt(e.target.value), crop.y[1]] })} />
                  </div>
                </div>

                <div className="y_to option columns">
                  <div className="option_title column has-text-centered">
                    <h6>y_to</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="y"
                      type="number"
                      value={crop.y[1]}
                      onChange={(e) => setCrop({ ...crop, y: [crop.y[0], parseInt(e.target.value)] })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleCropButtonClick}
              >Crop</Button>
            </div>

            <div className="resize">
              <div className="options mb-3">

                <div className="rows option columns">
                  <div className="option_title column has-text-centered">
                    <h6>y</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={resize.output_shape[0]}
                      onChange={(e) => setResize({ ...resize, output_shape: [parseInt(e.target.value), resize.output_shape[1]] })} />
                  </div>
                </div>

                <div className="x_to option columns">
                  <div className="cols column has-text-centered">
                    <h6>x</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={resize.output_shape[1]}
                      onChange={(e) => setResize({ ...resize, output_shape: [resize.output_shape[0], parseInt(e.target.value)] })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleResizeButtonClick}
              >Resize</Button>
            </div>

            <div className="affine_trasnform">
              <div className="options mb-3">

              <div className="matrix option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Matrix</h6>
                  </div>
                  <div className="inputs column">
                    *varsayılan değer kullanıldı. - (3,3) homojen transformation matrix
                  </div>
                </div>

                <div className="radius option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Rotation</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="rotation"
                      type="number"
                      value={affineTransform.rotation}
                      onChange={(e) => setAffineTransform({ ...affineTransform, rotation: parseFloat(e.target.value) })} />
                  </div>
                </div>

                <div className="hough_normalize option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Scale</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="scale"
                      type="number"
                      value={affineTransform.scale}
                      onChange={(e) => setAffineTransform({ ...affineTransform, scale: parseFloat(e.target.value) })} />
                  </div>
                </div>

                <div className="full_output option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Shear</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="shear"
                      type="number"
                      value={affineTransform.shear}
                      onChange={(e) => setAffineTransform({ ...affineTransform, shear: parseFloat(e.target.value) })} />
                  </div>
                </div>

                <div className="full_output option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Translation</h6>
                  </div>
                  <div className="inputs column">
                    x
                    <Input
                      placeholder="translation_x"
                      type="number"
                      value={affineTransform.translation[0]}
                      onChange={(e) => setAffineTransform({ ...affineTransform, translation: [parseFloat(e.target.value), affineTransform.translation[1]] })} />
                    y
                    <Input
                      placeholder="translation_y"
                      type="number"
                      value={affineTransform.translation[1]}
                      onChange={(e) => setAffineTransform({ ...affineTransform, translation: [affineTransform.translation[0], parseFloat(e.target.value)] })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleAffineTransformButtonClick}
              >Affine Transform</Button>
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

        <Loading
          show={states.isLoading}
        />

      </div>

      <ErrorPop
        error={states.warningMessage || ""}
        message={`Uygulama esnasında hata meydana geldi.\n Parametrelerin doğruluğundan ve görüntünün varlığından emin olun.`}
        show={states.showWarningMessage}
        onClose={() => setStates({ ...states, showWarningMessage: false })}
      />
    </div >
  );
}

export default App;
