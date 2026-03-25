import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, ThumbsDown, Plus, ChevronDown, ChevronUp, Send } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  user_id: string;
  title: string;
  body: string;
  crop_name: string | null;
  votes: number;
  answers_count: number;
  created_at: string;
}

interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  body: string;
  votes: number;
  is_accepted: boolean;
  created_at: string;
}

export default function CommunityPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [cropName, setCropName] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer[]>>({});
  const [answerText, setAnswerText] = useState("");
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from("community_questions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setQuestions(data);
  };

  const fetchVotes = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("community_votes")
      .select("question_id, answer_id, vote_type")
      .eq("user_id", user.id);
    if (data) {
      const map: Record<string, number> = {};
      data.forEach((v: any) => {
        const key = v.question_id || v.answer_id;
        map[key] = v.vote_type;
      });
      setUserVotes(map);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchVotes();
  }, [user]);

  const handleAskQuestion = async () => {
    if (!user || !title.trim() || !body.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("community_questions").insert({
      user_id: user.id,
      title: title.trim(),
      body: body.trim(),
      crop_name: cropName.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast.error(lang === "ki" ? "Habaye ikosa" : "Error posting question");
    } else {
      toast.success(lang === "ki" ? "Ikibazo cyoherejwe!" : "Question posted!");
      setTitle(""); setBody(""); setCropName(""); setShowForm(false);
      fetchQuestions();
    }
  };

  const fetchAnswers = async (qId: string) => {
    const { data } = await supabase
      .from("community_answers")
      .select("*")
      .eq("question_id", qId)
      .order("votes", { ascending: false });
    if (data) setAnswers(prev => ({ ...prev, [qId]: data }));
  };

  const toggleExpand = (qId: string) => {
    if (expandedQ === qId) {
      setExpandedQ(null);
    } else {
      setExpandedQ(qId);
      fetchAnswers(qId);
    }
  };

  const handleAnswer = async (qId: string) => {
    if (!user || !answerText.trim()) return;
    const { error } = await supabase.from("community_answers").insert({
      question_id: qId,
      user_id: user.id,
      body: answerText.trim(),
    });
    if (!error) {
      await supabase.from("community_questions").update({
        answers_count: (questions.find(q => q.id === qId)?.answers_count || 0) + 1,
      }).eq("id", qId);
      setAnswerText("");
      fetchAnswers(qId);
      fetchQuestions();
      toast.success(lang === "ki" ? "Igisubizo cyoherejwe!" : "Answer posted!");
    }
  };

  const handleVoteQuestion = async (qId: string, direction: number) => {
    if (!user) return;
    const existing = userVotes[qId];
    if (existing === direction) return;

    if (existing) {
      await supabase.from("community_votes").delete().eq("user_id", user.id).eq("question_id", qId);
    }
    await supabase.from("community_votes").insert({
      user_id: user.id,
      question_id: qId,
      vote_type: direction,
    });

    const q = questions.find(q => q.id === qId);
    if (q) {
      const delta = existing ? direction * 2 : direction;
      await supabase.from("community_questions").update({ votes: q.votes + delta }).eq("id", qId);
    }
    fetchQuestions();
    fetchVotes();
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display font-bold text-xl text-foreground">{t("community.title")}</h1>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
            <Plus className="w-4 h-4" />
            {t("community.ask")}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{t("community.subtitle")}</p>

        {showForm && (
          <Card className="mb-4">
            <CardContent className="p-4 space-y-3">
              <Input
                placeholder={lang === "ki" ? "Intego y'ikibazo..." : "Question title..."}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <Input
                placeholder={lang === "ki" ? "Izina ry'igihingwa (ntibisabwa)" : "Crop name (optional)"}
                value={cropName}
                onChange={e => setCropName(e.target.value)}
              />
              <Textarea
                placeholder={lang === "ki" ? "Sobanura ikibazo cyawe..." : "Describe your question..."}
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAskQuestion} disabled={loading || !title.trim() || !body.trim()} className="w-full">
                {loading ? (lang === "ki" ? "Birakoherezwa..." : "Posting...") : t("community.postQuestion")}
              </Button>
            </CardContent>
          </Card>
        )}

        {questions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">{t("community.noQuestions")}</p>
            <p className="text-sm text-muted-foreground/70 mt-1">{t("community.noQuestionsDesc")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map(q => (
              <Card key={q.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <button onClick={() => handleVoteQuestion(q.id, 1)} className={`p-1 rounded ${userVotes[q.id] === 1 ? "text-primary" : "text-muted-foreground"}`}>
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold">{q.votes}</span>
                      <button onClick={() => handleVoteQuestion(q.id, -1)} className={`p-1 rounded ${userVotes[q.id] === -1 ? "text-destructive" : "text-muted-foreground"}`}>
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-sm">{q.title}</h3>
                      {q.crop_name && (
                        <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full mt-1 font-semibold">{q.crop_name}</span>
                      )}
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{q.body}</p>
                      <button onClick={() => toggleExpand(q.id)} className="flex items-center gap-1 text-xs text-primary font-semibold mt-2">
                        <MessageSquare className="w-3 h-3" />
                        {q.answers_count} {lang === "ki" ? "ibisubizo" : "answers"}
                        {expandedQ === q.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {expandedQ === q.id && (
                    <div className="mt-3 pt-3 border-t border-border space-y-3">
                      {(answers[q.id] || []).map(a => (
                        <div key={a.id} className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm">{a.body}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <ThumbsUp className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{a.votes}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{new Date(a.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder={lang === "ki" ? "Andika igisubizo..." : "Write an answer..."}
                          value={answerText}
                          onChange={e => setAnswerText(e.target.value)}
                          className="flex-1 text-sm"
                        />
                        <Button size="icon" onClick={() => handleAnswer(q.id)} disabled={!answerText.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
