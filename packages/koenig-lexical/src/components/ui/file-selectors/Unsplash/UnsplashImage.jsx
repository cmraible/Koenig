import UnsplashButton from './UnsplashButton';

function UnsplashImage({payload,
    srcUrl,
    links,
    likes,
    user,
    alt,
    urls,
    height,
    width,
    zoomed, 
    insertImage, 
    selectImg}) {
    return (
        <div 
            data-kg-unsplash-gallery-item
            onClick={(e) => {
                e.stopPropagation();
                selectImg(zoomed ? null : payload);
            }} 
            className={`relative mb-6 block bg-grey-100 ${zoomed ? 'h-full w-[max-content] cursor-zoom-out' : 'w-full cursor-zoom-in'}`}>
            <img
                loading='lazy'
                data-kg-unsplash-gallery-img
                width={width}
                height={height}
                src={srcUrl}
                alt={alt}
                className={`${zoomed ? 'h-full w-auto object-contain' : ''}`} 
            />
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/5 via-black/5 to-black/30 p-5 opacity-0 transition-all ease-in-out hover:opacity-100">
                <div className="flex items-center justify-end">
                    {/* TODO: we may want to pass in the Ghost referral data from consuming app and parse to the urls */}
                    <UnsplashButton
                        data-kg-button="unsplash-like"
                        rel="noopener noreferrer" 
                        target="_blank" 
                        href={`${links.html}/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit`} 
                        icon="heart" 
                        label={likes} 
                    />
                    <UnsplashButton
                        data-kg-button="unsplash-download"
                        href={`${links.download}/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit&amp;force=true`} 
                        icon="download" 
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img className="mr-2 h-8 w-8 rounded-full" src={user.profile_image.small} alt="author" />
                        <div className="mr-2 truncate font-sans text-sm font-medium text-white">{user.name}</div>
                    </div>
                    <UnsplashButton data-kg-unsplash-insert-button onClick={(e) => {
                        e.stopPropagation();
                        insertImage({
                            src: urls.regular.replace(/&w=1080/, '&w=2000'),
                            caption: `Photo by ${user.name} on Unsplash`,
                            height: height,
                            width: width,
                            alt: alt,
                            links: links
                        });
                    }} label="Insert image" />
                </div>
            </div>
        </div>
    );
}

export default UnsplashImage;