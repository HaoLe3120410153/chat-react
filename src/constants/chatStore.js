import {create} from 'zustand';
import useUserStore from './userStore'

const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    changeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser;

      // Check if current user is blocked by user
        if (user.blocked.includes(currentUser.id)) {
        return set({
            chatId,
            user: null,
            isCurrentUserBlocked: true,
            isReceiverBlocked: false,
        });
        }
      // Check if receiver user is blocked by current user
        else if (currentUser.blocked.includes(user.id)) {
        return set({
            chatId,
            user: user,
            isCurrentUserBlocked: false,
            isReceiverBlocked: true,
        });
        } else {
        return set({
            chatId,
            user,
            isCurrentUserBlocked: false,
            isReceiverBlocked: false,
        });
        }
    },

    changeBlock: () => {
        set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
    },
    }));

export default useChatStore;