import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { MessageSquare, X, Send } from 'lucide-react-native';
import { chatAboutCar } from '../services/geminiService';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: 'Hi! I am the CarWise-AI assistant. Ask me anything about cars, reliability, or specs!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const reply = await chatAboutCar(userMessage, messages);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setIsOpen(true)}
      >
        <MessageSquare color="#E4E3E0" size={24} />
      </TouchableOpacity>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MessageSquare color="#E4E3E0" size={20} />
          <Text style={styles.headerTitle}>CARWISE ASSISTANT</Text>
        </View>
        <TouchableOpacity onPress={() => setIsOpen(false)}>
          <X color="#E4E3E0" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.modelBubble]}>
            <Text style={[styles.messageText, msg.role === 'user' ? styles.userText : styles.modelText]}>
              {msg.text}
            </Text>
          </View>
        ))}
        {isTyping && (
          <View style={[styles.messageBubble, styles.modelBubble, { flexDirection: 'row', alignItems: 'center' }]}>
            <ActivityIndicator size="small" color="#141414" style={{ marginRight: 8 }} />
            <Text style={styles.modelText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Ask about a car..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity 
          style={[styles.sendButton, (!input.trim() || isTyping) && { opacity: 0.5 }]} 
          onPress={handleSend}
          disabled={!input.trim() || isTyping}
        >
          <Send color="#E4E3E0" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#141414', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, zIndex: 999 },
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#E4E3E0', zIndex: 1000 },
  header: { backgroundColor: '#141414', paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { color: '#E4E3E0', fontWeight: 'bold', letterSpacing: 1, marginLeft: 8 },
  chatArea: { flex: 1, backgroundColor: 'rgba(255,255,255,0.5)' },
  chatContent: { padding: 20, gap: 16 },
  messageBubble: { maxWidth: '85%', padding: 16, borderRadius: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#141414' },
  modelBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(20,20,20,0.1)' },
  messageText: { fontSize: 14, lineHeight: 20 },
  userText: { color: '#E4E3E0' },
  modelText: { color: '#141414' },
  inputArea: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: 'rgba(20,20,20,0.1)', paddingBottom: 40 },
  input: { flex: 1, backgroundColor: '#E4E3E0', paddingHorizontal: 16, paddingVertical: 12, marginRight: 12, borderRadius: 8 },
  sendButton: { backgroundColor: '#141414', width: 48, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }
});
