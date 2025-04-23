
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CategoryDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Cybersecurity Assistant",
      description: "Get help with cybersecurity topics, ethical hacking, and penetration testing",
      path: "/study-assistant"
    },
    {
      title: "AI Image Creator",
      description: "Generate cyberpunk and tech-themed images using AI",
      path: "/image-generator"
    },
    {
      title: "YouTube Content Creator",
      description: "Create engaging tech-focused video content",
      path: "/youtube-creator"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border border-green-500/30 text-green-50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-400 mb-4">Welcome to Cyber Xiters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-gray-300 mb-4">Please select your preferred category to get started:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Button
                key={category.path}
                onClick={() => {
                  navigate(category.path);
                  onOpenChange(false);
                }}
                className="h-auto p-4 bg-gradient-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
              >
                <div className="text-left">
                  <h3 className="font-bold mb-2">{category.title}</h3>
                  <p className="text-xs text-gray-200">{category.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
