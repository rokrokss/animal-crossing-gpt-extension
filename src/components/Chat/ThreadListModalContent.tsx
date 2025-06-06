import { initialMessagesForAllThreadsAtom } from '@/hooks/chat';
import { threadIdAtom } from '@/hooks/global';
import { useThemeValue } from '@/hooks/layout';
import { deleteThread, ThreadWithInitialMessages } from '@/lib/indexDB';
import { getTimeString } from '@/lib/time';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ThreadListModal = ({ onClose }: { onClose: () => void }) => {
  const theme = useThemeValue();
  const [hoveredThreadId, setHoveredThreadId] = useState<string | null>(null);
  const [threadId, setThreadId] = useAtom(threadIdAtom);
  const threadsWithMessages = useAtomValue(initialMessagesForAllThreadsAtom);

  const { t } = useTranslation();

  const handleDeleteThread = (id: string) => {
    if (id === threadId) {
      setThreadId(undefined);
      deleteThread(id);
      onClose();
      return;
    }
    deleteThread(id);
  };

  const handleClickThread = (id: string) => {
    setThreadId(id);
    onClose();
  };

  const getThreadTitle = (thread: ThreadWithInitialMessages) => {
    if (thread.firstMessage?.actionType === 'askForSummary') {
      return t('overlayMenu.summarizePage') + ': ' + thread.firstMessage?.summaryTitle;
    }
    return thread.firstMessage?.content;
  };

  return (
    <>
      <div
        className={`sz:text-lg sz:font-semibold sz:mb-4 sz:text-center ${
          theme == 'dark' ? 'sz:text-white' : 'sz:text-black'
        }`}
      >
        {t('chat.history')}
      </div>
      <div className="sz:flex sz:flex-col sz:gap-3 sz:overflow-y-auto sz:scrollbar-hidden sz:max-h-[70vh]">
        {threadsWithMessages.length > 0 ? (
          threadsWithMessages.map((thread) => {
            const isSelected = thread.threadId === threadId;
            const isHovered = hoveredThreadId === thread.threadId;
            return (
              <div
                key={thread.threadId}
                className="sz:flex sz:items-center"
                onMouseEnter={() => setHoveredThreadId(thread.threadId)}
                onMouseLeave={() => setHoveredThreadId(null)}
              >
                <Button
                  type="text"
                  className="sz:flex-1 sz:text-left sz:max-w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickThread(thread.threadId);
                  }}
                  style={{
                    backgroundColor:
                      isSelected || isHovered
                        ? theme == 'dark'
                          ? '#141414'
                          : '#e0f0f0'
                        : 'transparent',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    height: '55px',
                  }}
                >
                  <div className="sz:flex sz:flex-col sz:justify-between sz:w-full sz:font-ycom sz:pt-2 sz:pb-2">
                    <div
                      className="sz:max-w-full sz:flex sz:flex-row sz:min-w-full sz:justify-between sz:gap-2"
                      style={{
                        color: isSelected ? (theme == 'dark' ? 'white' : 'black') : '#777',
                      }}
                    >
                      <div
                        className={`sz:text-sm sz:overflow-hidden sz:text-ellipsis sz:whitespace-nowrap ${
                          theme == 'dark' ? 'sz:text-white' : 'sz:text-black'
                        }`}
                      >
                        {getThreadTitle(thread)}
                      </div>
                      <div
                        className={`sz:text-xs ${
                          theme == 'dark' ? 'sz:text-[#ccc]' : 'sz:text-gray-500'
                        }`}
                      >
                        {getTimeString(thread.updatedAt, t)}
                      </div>
                    </div>
                    <div
                      className="sz:max-w-full sz:flex sz:flex-row sz:min-w-full sz:justify-between sz:gap-2"
                      style={{
                        color: isSelected
                          ? theme == 'dark'
                            ? 'white'
                            : 'black'
                          : theme == 'dark'
                          ? '#ccc'
                          : '#777',
                      }}
                    >
                      <div className="sz:text-sm sz:overflow-hidden sz:text-ellipsis sz:whitespace-nowrap sz:pt-[3px]">
                        {'> ' + thread.secondMessage?.content}
                      </div>
                      <div className="sz:text-xs sz:text-gray-500 sz:flex sz:flex-row sz:gap-1 sz:w-6">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteThread(thread.threadId);
                          }}
                          className="sz:text-gray-400 sz:hover:text-red-400 sz:cursor-pointer sz:w-6 sz:h-6 sz:flex sz:items-center sz:justify-center"
                          style={{
                            fontSize: '15px',
                            visibility: isHovered || isSelected ? 'visible' : 'hidden',
                          }}
                        >
                          <DeleteOutlined />
                        </div>
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            );
          })
        ) : (
          <div className="sz:text-center sz:text-gray-500 sz:text-base">{t('chat.empty')}</div>
        )}
      </div>
    </>
  );
};

export default ThreadListModal;
