import React, { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

const AdBanner: React.FC = () => {
    // IMPORTANT: These IDs must be configured as Environment Variables in your hosting provider (e.g., Vercel, Netlify).
    // Do not hardcode your real IDs here.
    const adClient = process.env.ADSENSE_CLIENT_ID;
    const adSlot = process.env.ADSENSE_SLOT_ID;

    useEffect(() => {
        if (!adClient || !adSlot) {
            console.warn("AdSense client or slot ID not configured. Ads will not display.");
            return;
        }

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, [adClient, adSlot]);

    if (!adClient || !adSlot) {
        return (
            <div className="flex items-center justify-center h-24 bg-gray-900/50 border border-dashed border-gray-700 rounded-lg text-gray-500">
                Ad Placeholder - Configure AdSense IDs to enable
            </div>
        );
    }

    return (
        <div className="flex justify-center my-4">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default AdBanner;