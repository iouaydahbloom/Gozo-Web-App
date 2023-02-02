import { useState } from "react";

const useMessagesInterval = (messages: string[], duration: number = 5000) => {
    const [messagesInterval, setMessagesInterval] = useState<any>();
    const [loadingDisplayMessage, setLoadingDisplayMessage] = useState(messages[0]);
    var displayMessagesCounter = 0;

    function setDisplayMessagesInterval() {
        setMessagesInterval(setInterval(handleLoadingMessageChange, duration))
    }


    function handleLoadingMessageChange() {
        if (displayMessagesCounter >= messages.length - 1) {
            displayMessagesCounter = messages.length - 1;
            setLoadingDisplayMessage(messages[displayMessagesCounter]);
            return
        }
        displayMessagesCounter++
        setLoadingDisplayMessage(messages[displayMessagesCounter]);
    }

    function clearDisplayMessageInterval() {
        clearInterval(messagesInterval)
        setLoadingDisplayMessage(messages[0]);
    }

    return {
        start:setDisplayMessagesInterval,
        stop:clearDisplayMessageInterval,
        currentMessage:loadingDisplayMessage

    }
}

export default useMessagesInterval;