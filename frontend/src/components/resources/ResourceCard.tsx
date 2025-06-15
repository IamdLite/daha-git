import { Card, CardContent, Typography, Button, Box, Chip, Stack, useTheme } from '@mui/material';
import { Resource, Subject, Grade, DifficultyLevel } from '../../types';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const theme = useTheme();
  
  // Форматирование даты с правильным склонением месяца и годом
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Месяцы в родительном падеже
    const monthsGenitive = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    const month = monthsGenitive[date.getMonth()];
    return `${day} ${month} ${year}`;
  };
  
  const subjectLabels: Record<string, string> = {
    [Subject.AI]: 'Искусственный интеллект',
    [Subject.ROBOTICS]: 'Робототехника',
    [Subject.PROGRAMMING]: 'Программирование',
    [Subject.CYBERSECURITY]: 'Информационная безопасность',
    [Subject.ENTREPRENEURSHIP]: 'Предпринимательство',
    [Subject.FINANCIAL_LITERACY]: 'Финансовая грамотность',
    [Subject.SCIENCE]: 'Наука',
  };

  const subjectColors: Record<string, string> = {
    [Subject.AI]: '#3f51b5',
    [Subject.ROBOTICS]: '#9c27b0',
    [Subject.PROGRAMMING]: '#00bfa5',
    [Subject.CYBERSECURITY]: '#f44336',
    [Subject.ENTREPRENEURSHIP]: '#ff9800',
    [Subject.FINANCIAL_LITERACY]: '#2196f3',
    [Subject.SCIENCE]: '#4caf50',
  };

  // Добавим объект с метками для классов (без слова "класс")
  const gradeLabels: Record<string, string> = {
    [Grade.GRADE_7]: '7',
    [Grade.GRADE_8]: '8',
    [Grade.GRADE_9]: '9',
    [Grade.GRADE_10]: '10',
    [Grade.GRADE_11]: '11',
  };
  
  // Добавим метки для уровней сложности
  const difficultyLabels: Record<string, string> = {
    [DifficultyLevel.BEGINNER]: 'Уровень: начальный',
    [DifficultyLevel.INTERMEDIATE]: 'Уровень: средний',
    [DifficultyLevel.ADVANCED]: 'Уровень: продвинутый',
  };

  // Расширенные описания курсов (2-3 предложения)
  const getEnhancedDescription = (description: string) => {
    // Если описание уже достаточно длинное, используем его как есть
    if (description.length > 150) return description;
    
    // Проверяем и исправляем окончание первоначального описания
    let formattedDescription = description;
    
    // Добавляем точку в конце, если её нет и описание не заканчивается на знак пунктуации
    if (formattedDescription && 
        !formattedDescription.endsWith('.') && 
        !formattedDescription.endsWith('!') && 
        !formattedDescription.endsWith('?')) {
      formattedDescription += '.';
    }
    
    // Дополнительные предложения для различных предметов
    const additionalDescriptions: Record<string, string[]> = {
      [Subject.AI]: [
        'Слушатели осваивают практические навыки построения нейронных сетей и работы с большими данными.',
        'Курс включает работу с реальными проектами и актуальными инструментами искусственного интеллекта.'
      ],
      [Subject.ROBOTICS]: [
        'Участники создадут собственные роботизированные системы с применением современных технологий.',
        'Программа включает проектирование, сборку и программирование автономных устройств.'
      ],
      [Subject.PROGRAMMING]: [
        'Обучение строится на решении практических задач с постепенным повышением сложности.',
        'Участники научатся писать оптимальный и читаемый код, работая над реальными проектами.'
      ],
      [Subject.CYBERSECURITY]: [
        'Изучаются методы защиты информации и противодействия современным киберугрозам.',
        'Курс дает практические навыки обнаружения уязвимостей и построения защищенных систем.'
      ],
      [Subject.ENTREPRENEURSHIP]: [
        'Слушатели разработают собственный бизнес-план и изучат стратегии привлечения инвестиций.',
        'В программу включены мастер-классы от успешных предпринимателей и венчурных инвесторов.'
      ],
      [Subject.FINANCIAL_LITERACY]: [
        'Участники научатся эффективно управлять личными финансами и создавать пассивный доход.',
        'Курс включает разбор реальных инвестиционных стратегий и финансовых инструментов.'
      ],
      [Subject.SCIENCE]: [
        'Программа сочетает теоретическую подготовку с практическими экспериментами и исследованиями.',
        'Участники работают с современным научным оборудованием под руководством ученых-практиков.'
      ],
    };
    
    // Выбираем предмет для дополнительного описания
    if (resource.subjects && resource.subjects.length > 0) {
      const primarySubject = resource.subjects[0];
      const additions = additionalDescriptions[primarySubject];
      
      if (additions) {
        return `${formattedDescription} ${additions.join(' ')}`;
      }
    }
    
    // Общие дополнения, если не нашлось по предмету
    return `${formattedDescription} Программа разработана ведущими специалистами с учетом современных требований отрасли. Участники получат актуальные знания и ценные практические навыки.`;
  };

  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      borderRadius: { xs: '6px', sm: '8px' },
      overflow: 'visible',
      backgroundColor: 'white',
      boxShadow: 'none',
      border: '1px solid #e0e0e0',
      '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      },
      position: 'relative',
      mb: { xs: 2, sm: 3 },
      width: '100%'
    }}>
      <CardContent sx={{ 
        pt: { xs: 2.5, sm: 3, md: 3.5 },
        pb: { xs: 1.5, sm: 2 },
        flexGrow: 1, 
        px: { xs: 2, sm: 2.5, md: 3 },
        display: 'flex', 
        flexDirection: 'column',
        gap: { xs: 1, sm: 1.5 }
      }}>
        {/* Заголовок - крупным шрифтом */}
        <Typography 
          component="div" 
          variant="h5" 
          sx={{ 
            fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.5rem' },
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            color: '#4361ee', // Более яркий синий цвет для заголовка
            mb: { xs: 0.3, sm: 0.5 }
          }}
        >
          {resource.title}
        </Typography>
        
        {/* Организатор курса - более заметно, без "в" */}
        {resource.organizer && (
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
              mb: { xs: 0.5, sm: 1 },
              color: '#616161'
            }}
          >
            {resource.organizer}
          </Typography>
        )}

        {/* Даты как аналог зарплаты */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.2rem', sm: '1.25rem', md: '1.35rem' },
            mb: { xs: 1.5, sm: 2 },
            color: '#000',
            letterSpacing: '-0.01em'
          }}
        >
          {formatDate(resource.startDate)} — {formatDate(resource.endDate)}
        </Typography>

        {/* Чипсы для классов и типа */}
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: { xs: 1.5, sm: 2 } }}>
          {resource.grades.map((grade) => (
            <Chip
              key={grade}
              label={`${gradeLabels[grade]} класс`}
              size="medium"
              sx={{
                borderRadius: { xs: '4px', sm: '6px' },
                backgroundColor: '#f5f5f5',
                color: '#333',
                px: { xs: 1, sm: 1.5 },
                py: { xs: 2, sm: 2.5 },
                height: 'auto',
                mb: 1,
                fontWeight: 500,
                fontSize: { xs: '0.85rem', sm: '0.9rem' }
              }}
            />
          ))}
          {resource.difficultyLevel && (
            <Chip
              label={difficultyLabels[resource.difficultyLevel]}
              size="medium"
              sx={{
                borderRadius: { xs: '4px', sm: '6px' },
                backgroundColor: '#f0f7ff',
                color: '#0066cc',
                px: { xs: 1, sm: 1.5 },
                py: { xs: 2, sm: 2.5 },
                height: 'auto',
                mb: 1,
                fontWeight: 500,
                fontSize: { xs: '0.85rem', sm: '0.9rem' }
              }}
            />
          )}
        </Stack>

        {/* Описание с расширенным содержанием */}
        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="body1"
            sx={{
              lineHeight: { xs: 1.5, sm: 1.6 },
              color: '#333333',
              fontSize: { xs: '0.95rem', sm: '1rem' }
            }}
          >
            {getEnhancedDescription(resource.description)}
          </Typography>
        </Box>

        {/* Блок с предметами (без заголовка) */}
        <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
            {resource.subjects.map((subject) => (
              <Chip 
                key={subject} 
                label={subjectLabels[subject]} 
                size="medium" 
                sx={{ 
                  mb: 0.75,
                  fontWeight: 500,
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  backgroundColor: `${subjectColors[subject]}10`,
                  color: subjectColors[subject],
                  height: { xs: '28px', sm: '32px' },
                  borderRadius: { xs: '4px', sm: '6px' },
                  px: { xs: 0.5, sm: 1 },
                  '&:hover': {
                    backgroundColor: `${subjectColors[subject]}20`,
                  }
                }}
              />
            ))}
          </Stack>
        </Box>
      </CardContent>
      
      {/* Кнопка внизу карточки */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: { xs: 2, sm: 2.5, md: 3 }, pb: { xs: 2, sm: 2.5, md: 3 }, mt: 'auto' }}>
        <Button 
          variant="contained" 
          href={resource.url} 
          target="_blank" 
          rel="noopener"
          sx={{ 
            borderRadius: '4px',
            px: { xs: 3, sm: 3.5, md: 4 },
            py: { xs: 0.75, sm: 1 },
            fontWeight: 600,
            letterSpacing: '0.01em',
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
            boxShadow: 'none',
            backgroundColor: '#000',
            color: '#fff',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#333',
              boxShadow: 'none'
            }
          }}
        >
          Ссылка на курс
        </Button>
      </Box>
    </Card>
  );
};

export default ResourceCard;
