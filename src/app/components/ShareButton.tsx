import React from "react"
import { Share } from "lucide-react"
import { Button } from "./Button"

interface ShareButtonProps {
  link: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ link }) => {
    const onShare = async () => {
        if (!navigator.share) {
            console.log("Web Share API not supported");
            return;
        }

        try {
            await navigator.share({
                title: "Share Secret",
                text: "Check out this secret!",
                url: link,
            })
            console.log("Secret shared successfully")
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
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