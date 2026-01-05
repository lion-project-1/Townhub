package com.example.backend.service;


import com.example.backend.domain.Location;
import com.example.backend.domain.Question;
import com.example.backend.domain.User;
import com.example.backend.dto.QuestionCreateRequest;
import com.example.backend.dto.QuestionResponseRequest;
import com.example.backend.dto.QuestionSearchRequest;
import com.example.backend.dto.QuestionUpdateRequest;
import com.example.backend.enums.QuestionCategory;
import com.example.backend.global.exception.custom.CustomException;
import com.example.backend.global.exception.custom.ErrorCode;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.AnswerRepository;
import com.example.backend.repository.QuestionRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import lombok.RequiredArgsConstructor;




@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    // 질문 등록
    @Transactional
    public Long createQuestion(Long userId, QuestionCreateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));


        Question question = Question.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .questionCategory(request.getQuestionCategory())
                .user(user)
                .location(user.getLocation())
                .build();

        questionRepository.save(question);

        return question.getId();

    }


     // 질문 목록 조회
     public Page<QuestionResponseRequest> getQuestions(
             QuestionSearchRequest request,
             Pageable pageable
     ) {
         Page<Question> questions =
                 questionRepository.search(request, pageable);

         return questions.map(QuestionResponseRequest::new);
     }



    // 질문 상세

    public QuestionResponseRequest getQuestionData(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("질문이 존재하지 않음"));

        return new QuestionResponseRequest(question);
    }

    /**
     * 조회수 1 증가
     */
    @Transactional
    public QuestionResponseRequest incrementQuestionViews(Long questionId) {
        questionRepository.increaseViewCount(questionId); // 쿼리에서 update 실행
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("질문이 존재하지 않음"));

        return new QuestionResponseRequest(question);
    }


    private final AnswerRepository answerRepository;

    @Transactional
    public void updateQuestion(Long questionId, Long loginUserId, QuestionUpdateRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        // if (!question.getUser().getId().equals(loginUserId)) {
        //     throw new CustomException(ErrorCode.QUESTION_UPDATE_FORBIDDEN);
        // }

        question.update(request.getQuestionCategory(), request.getTitle(), request.getContent());
    }


    @Transactional
    public void deleteQuestion(Long questionId, Long userId) {

        answerRepository.deleteByQuestionId(questionId);

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        // if (!question.getUser().getId().equals(userId)) {
        //     throw new CustomException(ErrorCode.QUESTION_UPDATE_FORBIDDEN);
        // }

        questionRepository.delete(question);
    }
}