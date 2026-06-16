import { EmergencyCard } from '@/types/card'
import { CardStatus, CardVisibility } from '@/types/common'

export const mockCards: EmergencyCard[] = [
  { id: 'card1', elderId: 'e1', elderName: '张秀英', community: '雨花社区', cardNo: 'YHY20240001', qrToken: 'token-e1-2024', visibilityLevel: CardVisibility.CONTACT, emergencyNote: '紧急联系人详见卡片背面', status: CardStatus.ACTIVE, createdAt: '2024-09-15', printedAt: '2024-09-16' },
  { id: 'card2', elderId: 'e2', elderName: '李大勇', community: '东山社区', cardNo: 'YHY20240002', qrToken: 'token-e2-2024', visibilityLevel: CardVisibility.CONTACT, emergencyNote: '曾有心梗史，随身携带硝酸甘油', status: CardStatus.ACTIVE, createdAt: '2024-09-10', printedAt: '2024-09-11' },
  { id: 'card3', elderId: 'e3', elderName: '王淑芬', community: '雨花社区', cardNo: 'YHY20240003', qrToken: 'token-e3-2024', visibilityLevel: CardVisibility.MINIMAL, status: CardStatus.ACTIVE, createdAt: '2024-09-18', printedAt: '2024-09-19' },
  { id: 'card4', elderId: 'e4', elderName: '张德明', community: '玄武湖社区', cardNo: 'YHY20240004', qrToken: 'token-e4-2024', visibilityLevel: CardVisibility.CONTACT, emergencyNote: '冬季易发呼吸道感染', status: CardStatus.ACTIVE, createdAt: '2024-09-22', printedAt: '2024-09-23' },
  { id: 'card5', elderId: 'e5', elderName: '赵文英', community: '雨花社区', cardNo: 'YHY20240005', qrToken: 'token-e5-2024', visibilityLevel: CardVisibility.CONTACT, emergencyNote: '视力较差，请注意协助', status: CardStatus.ACTIVE, createdAt: '2024-09-20', printedAt: '2024-09-21' },
  { id: 'card6', elderId: 'e6', elderName: '刘建国', community: '东山社区', cardNo: 'YHY20240006', qrToken: 'token-e6-2024', visibilityLevel: CardVisibility.MINIMAL, status: CardStatus.ACTIVE, createdAt: '2024-09-25', printedAt: '2024-09-26' },
  { id: 'card7', elderId: 'e7', elderName: '陈桂芳', community: '玄武湖社区', cardNo: 'YHY20240007', qrToken: 'token-e7-2024', visibilityLevel: CardVisibility.MINIMAL, status: CardStatus.ACTIVE, createdAt: '2024-09-28' },
  { id: 'card8', elderId: 'e8', elderName: '周大爷', community: '雨花社区', cardNo: 'YHY20240008', qrToken: 'token-e8-2024', visibilityLevel: CardVisibility.CONTACT, emergencyNote: '行动不便需拐杖辅助', status: CardStatus.ACTIVE, createdAt: '2024-09-15', printedAt: '2024-09-16' },
  { id: 'card9', elderId: 'e11', elderName: '冯奶奶', community: '雨花社区', cardNo: 'YHY20240009', qrToken: 'token-e11-2024', visibilityLevel: CardVisibility.CONTACT, emergencyNote: '左半身偏瘫需轮椅', status: CardStatus.ACTIVE, createdAt: '2024-10-01', printedAt: '2024-10-02' },
  { id: 'card10', elderId: 'e12', elderName: '曹大爷', community: '东山社区', cardNo: 'YHY20240010', qrToken: 'token-e12-2024', visibilityLevel: CardVisibility.MINIMAL, status: CardStatus.ACTIVE, createdAt: '2024-11-01' },
  { id: 'card11', elderId: 'e13', elderName: '许阿姨', community: '玄武湖社区', cardNo: 'YHY20240011', qrToken: 'token-e13-2024', visibilityLevel: CardVisibility.CONTACT, emergencyNote: '心功能不全，避免剧烈活动', status: CardStatus.ACTIVE, createdAt: '2024-10-10', printedAt: '2024-10-11' },
  { id: 'card12', elderId: 'e14', elderName: '董先生', community: '雨花社区', cardNo: 'YHY20240012', qrToken: 'token-e14-2024', visibilityLevel: CardVisibility.MINIMAL, status: CardStatus.ACTIVE, createdAt: '2024-10-15' },
  { id: 'card13', elderId: 'e15', elderName: '金婆婆', community: '东山社区', cardNo: 'YHY20240013', qrToken: 'token-e15-2024', visibilityLevel: CardVisibility.CONTACT, emergencyNote: '独居，只会讲方言', status: CardStatus.ACTIVE, createdAt: '2024-10-20', printedAt: '2024-10-21' },
]
