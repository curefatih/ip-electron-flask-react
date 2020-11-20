import matplotlib.pyplot as plt
from skimage import data, io, exposure, color
from io import BytesIO
import base64
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from ..util import to_img, to_base64


def run(img):

    fig, axes = plt.subplots(nrows=2, ncols=3, figsize=(8, 4))
    for ax in axes[1, :]:
        ax.remove()
    for c, c_color in enumerate(('red', 'green', 'blue')):
        img_hist, bins = exposure.histogram(img[..., c], source_range='dtype')
        axes[0, c].plot(bins, img_hist / img_hist.max())
        img_cdf, bins = exposure.cumulative_distribution(img[..., c])
        axes[0, c].plot(bins, img_cdf)
        axes[0, c].set_ylabel(c_color)

    img_gray = color.rgb2gray(img)
    hist, hist_centers = exposure.histogram(color.rgb2gray(img))
    hist_centers.ravel()
    img_cdf, bins = exposure.cumulative_distribution(img_gray)
    gs = axes[1, 2].get_gridspec()

    axs_gray = fig.add_subplot(gs[1:, :])
    # axs_gray.plot(bins, hist / hist.max())
    axs_gray.plot(hist_centers, hist)
    # img_cdf, bins = exposure.cumulative_distribution(img_gray)
    # axs_gray.plot(bins, img_cdf)
    axs_gray.set_ylabel("gray")

    axes[0, 1].set_title('Histogram')
    plt.tight_layout()
    buf = BytesIO()
    fig.savefig(buf, format="png")
    data = base64.b64encode(buf.getbuffer()).decode("ascii")

    # Save as base64

    buf = BytesIO()
    fig.savefig(buf, format="png")
    # Embed the result in the html output.
    data = base64.b64encode(buf.getbuffer()).decode("ascii")
    return f"{data}"
