import MainListeningScreen from "@/components/MainListeningScreen";

const Index = () => {
  const handleLike = (clipId: string, liked: boolean) => {
    console.log(`Episode ${clipId} ${liked ? 'liked' : 'unliked'}`);
  };

  const handleComprehension = (clipId: string, percentage: number) => {
    console.log(`Episode ${clipId} comprehension: ${percentage}%`);
  };

  const handleContentChange = (direction: 'forward' | 'backward') => {
    console.log(`Content change requested: ${direction}`);
  };

  return (
    <MainListeningScreen
      onLike={handleLike}
      onComprehensionReport={handleComprehension}
      onContentChange={handleContentChange}
    />
  );
};

export default Index;
