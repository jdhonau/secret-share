import React from "react"
import { Share } from "lucide-react"
import { Button } from "./Button"

const ShareButton = () => {
    const onShare = async () => {
        if (!navigator.share) {
            console.log("Web Share API not supported");
            return;
        }

        try {
            await navigator.share({
                title: "Share Secret",
                text: "Check out this secret!",
                url: window.location.href,
            })
            console.log("Secret shared successfully")
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Error sharing secret:", error)
            }
        }
    };

    // Only render if Web Share API is supported
    if (!navigator.share) {
        return null;
    }

    return (
        <Button variant="outline" onClick={onShare}>
            <Share className="w-4 h-4 mr-2" />
            Share
        </Button>
    );
};

export default ShareButton;